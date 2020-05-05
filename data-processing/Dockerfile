FROM python:3

RUN apt-get update && apt-get install --no-install-recommends -y \
     libspatialindex-dev \
     unzip && \
     rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

ENV PYTHONPATH=/opt/src:/opt/lib:$PYTHONPATH

COPY entrypoint.sh /opt/entrypoint.sh

ENTRYPOINT [ "/opt/entrypoint.sh" ]
