# Inflação com Contexto — versão de produção

Site estático (sem servidor, sem banco de dados). Basta hospedar esta pasta.

## Arquivos
- `index.html`: página principal (calculadora, gráfico, linha do tempo, consultoria, perguntas frequentes).
- `privacidade.html`: política de privacidade (preencha os campos entre colchetes).
- `config.js`: **único arquivo que você precisa editar** (link da consultoria, AdSense, modo de prévia).
- `dados.js`: séries oficiais do Banco Central (gerado automaticamente).
- `eventos.js`: linha do tempo e presidentes (edição manual).
- `assets/`: estilo e código da calculadora.
- `scripts/atualizar_dados.py` e `.github/workflows/atualizar-dados.yml`: atualização mensal automática.
- `robots.txt`, `sitemap.xml`, `ads.txt`: arquivos para buscadores e AdSense.

## Antes de publicar
1. O domínio quantoera.com já está configurado em `index.html`, `privacidade.html`, `robots.txt` e `sitemap.xml`.
2. Os dados do responsável em `privacidade.html` já estão preenchidos; confira e peça revisão a um advogado.
3. Em `config.js`: defina `CONSULTORIA_URL` (ex.: WhatsApp) e coloque `MODO_PREVIA: false`.
4. Confira as regras da CVM sobre divulgação de serviços de consultoria, se aplicável à sua atuação.

## Publicar (grátis)
1. Crie um repositório no GitHub e envie esta pasta (inclusive `.github`).
2. No Cloudflare Pages (ou Netlify), conecte o repositório. Não há build: pasta de saída = raiz.
3. Registre o domínio .com.br no Registro.br e aponte para o serviço de hospedagem.

## Atualização mensal
O GitHub Actions roda todo dia entre 10 e 20 de cada mês, baixa as séries 433 e 1619 do Banco Central e só publica se houver dado novo. A hospedagem republica sozinha a cada commit. Para rodar manualmente: Actions > "Atualizar dados do Banco Central" > Run workflow. Também funciona localmente: `python3 scripts/atualizar_dados.py`.
Se o salário mínimo mudar (reajuste de janeiro), a série 1619 do Banco Central é atualizada; confira se o valor novo apareceu.

## Anúncios (Google AdSense)
1. Com o site no ar e com conteúdo, peça aprovação em adsense.google.com. A calculadora sozinha pode ser recusada: publique também páginas de texto (ex.: "inflação por década", "como calcular a inflação").
2. Aprovado, preencha `ADSENSE_CLIENT` e os IDs de `SLOTS` em `config.js` e o `ads.txt`.
3. Os anúncios só carregam depois que o visitante aceita o aviso de cookies.

## O que manter manualmente
- `eventos.js`: acrescente fatos de novos anos, só de fontes confiáveis e neutras.
- `ads.txt` e `privacidade.html`: após a aprovação do AdSense.
