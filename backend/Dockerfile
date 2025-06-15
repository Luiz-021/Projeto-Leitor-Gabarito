FROM ubuntu:23.10

RUN sed -i \
    -e 's|http://archive.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' \
    -e 's|http://security.ubuntu.com/ubuntu|http://old-releases.ubuntu.com/ubuntu|g' \
    /etc/apt/sources.list

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    LD_LIBRARY_PATH="/app/libs" \
    LIBLEITOR_PATH="/app/libs/libleitor.so"

RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
      python3 \
      python3-pip \
      python3-venv \
      build-essential \
      libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/python3 /usr/bin/python \
 && ln -sf /usr/bin/pip3   /usr/bin/pip

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --break-system-packages -r requirements.txt

COPY . /app/

COPY libs/ /app/libs/

COPY data/ /app/data/

COPY registro/management/commands/import_data.py \
     /app/registro/management/commands/import_data.py

EXPOSE 8000

CMD ["sh","-c","python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

