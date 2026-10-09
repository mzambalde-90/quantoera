#!/usr/bin/env python3
"""Atualiza dados.js com as séries oficiais do Banco Central (SGS).
433  = IPCA, variação mensal (%), calculado pelo IBGE
1619 = Salário mínimo (R$)
Uso: python3 scripts/atualizar_dados.py
Só usa a biblioteca padrão do Python (3.8+)."""
import json, datetime, pathlib, re, urllib.request

RAIZ = pathlib.Path(__file__).resolve().parent.parent
URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{s}/dados?formato=json&dataInicial={a}&dataFinal={b}"
INICIO_REAL = 1994 * 12 + 6  # julho de 1994


def baixar(serie, ini=1994):
    fim, linhas, a = datetime.date.today().year, [], ini
    while a <= fim:  # janelas de 10 anos, por precaução com limites da API
        b = min(a + 9, fim)
        url = URL.format(s=serie, a=f"01/01/{a}", b=f"31/12/{b}")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            linhas += json.load(r)
        a = b + 1
    return linhas


def mes(d):
    _, mm, yy = d.split("/")
    return int(yy), int(mm) - 1


def num(v):
    return float(str(v).replace(",", "."))


def montar_ipca(linhas):
    D = {}
    for l in sorted(linhas, key=lambda l: mes(l["data"])):
        y, m = mes(l["data"])
        lista = D.setdefault(y, [])
        if m != len(lista):
            raise ValueError(f"Série do IPCA com mês faltando em {m + 1}/{y}")
        lista.append(num(l["valor"]))
    if 1994 not in D or len(D[1994]) != 12:
        raise ValueError("Série do IPCA sem 1994 completo")
    return D


def montar_salario(linhas):
    passos, ultimo = [], None
    for l in sorted(linhas, key=lambda l: mes(l["data"])):
        y, m = mes(l["data"])
        v = num(l["valor"])
        if y * 12 + m >= INICIO_REAL and v != ultimo:
            passos.append([y, m, v])
            ultimo = v
    if not passos or passos[0][:2] != [1994, 6]:
        raise ValueError("Série do salário mínimo não começa em jul/1994")
    return passos


def escrever(ipca, salario, hoje=None):
    hoje = hoje or datetime.date.today().isoformat()
    corpo = ",\n".join(f'"{y}":{json.dumps(v)}' for y, v in sorted(ipca.items()))
    txt = (f'window.DADOS={{"atualizadoEm":"{hoje}",\n"ipca":{{\n{corpo}\n}},\n'
           f'"salario":{json.dumps(salario)}}};\n')
    (RAIZ / "dados.js").write_text(txt, encoding="utf-8")
    mapa = RAIZ / "sitemap.xml"
    if mapa.exists():
        mapa.write_text(re.sub(r"<lastmod>.*?</lastmod>", f"<lastmod>{hoje}</lastmod>",
                               mapa.read_text(encoding="utf-8")), encoding="utf-8")


if __name__ == "__main__":
    escrever(montar_ipca(baixar(433)), montar_salario(baixar(1619)))
    print("dados.js atualizado")
