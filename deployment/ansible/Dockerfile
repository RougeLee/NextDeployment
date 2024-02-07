FROM python:3.8-slim
RUN pip install ansible
RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://releases.hashicorp.com/consul/1.9.5/consul_1.9.5_linux_amd64.zip && \
    unzip consul_1.9.5_linux_amd64.zip && \
    mv consul /usr/local/bin/ && \
    rm -f consul_1.9.5_linux_amd64.zip
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
WORKDIR /ansible
CMD [ "ansible-playbook", "--version" ]