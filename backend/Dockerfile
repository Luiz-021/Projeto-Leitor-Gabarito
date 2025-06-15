FROM ubuntu:23.10

# 1) Aponta o apt para os espelhos legacy que ainda guardam o Mantic
RUN sed -i \
    -e 's|http://archive.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' \
    -e 's|http://security.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' \
    /etc/apt/sources.list

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    LD_LIBRARY_PATH="/app/libs" \
    LIBLEITOR_PATH="/app/libs/libleitor.so"

# 2) Instala Python 3 (meta‑package), pip, venv e deps de sistema
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      python3 \
      python3-pip \
      python3-venv \
      build-essential \
      libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 3) Cria/atualiza symlink para “python” e “pip”
RUN ln -sf /usr/bin/python3 /usr/bin/python \
 && ln -sf /usr/bin/pip3   /usr/bin/pip

WORKDIR /app

# 4) Instala requisitos Python (inclui Pillow, DRF etc.)
COPY requirements.txt /app/
RUN pip install --break-system-packages -r requirements.txt

# 5) Copia app e libs nativas
COPY . /app/

COPY libs/ /app/libs/

# 7. Copia arquivos de dados RAW (CSV) para dentro do container
COPY data/ /app/data/

# 8. Copia o management command para o local correto
COPY registro/management/commands/import_data.py \
     /app/registro/management/commands/import_data.py

EXPOSE 8000

# 6) Migrações e servidor
CMD ["sh","-c","python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

