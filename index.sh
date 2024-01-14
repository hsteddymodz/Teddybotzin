#!/bin/bash

MARKER_FILE="$HOME/.termux/installed"

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

if [ ! -e "$MARKER_FILE" ]; then
    NOCOLOR='\033[0m'
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    ORANGE='\033[0;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    LIGHTGRAY='\033[0;37m'
    DARKGRAY='\033[1;30m'
    PURPLE='\033[1;31m'
    LIGHTGREEN='\033[1;32m'
    YELLOW='\033[1;33m'
    LIGHTRED='\033[1;34m'
    LIGHTPURPLE='\033[1;35m'
    LIGHTCYAN='\033[1;36m'
    WHITE='\033[1;37m'

    if [ -d "$HOME/.termux" ]; then
        if command_exists "apt-get"; then
            apt-get upgrade
            apt-get update
            apt upgrade -y
            apt update -y
            apt install nodejs -y 
            apt install nodejs-lts -y 
            apt install ffmpeg -y
            apt install wget -y 
            apt install git -y

            touch "$MARKER_FILE"
        else
            echo "Comando 'apt-get' não encontrado. Instale as dependências manualmente."
            exit 1
        fi
    else
        if [ "$(uname)" == "Linux" ]; then
            echo "É um ambiente no computador (host), não instalará dependências automaticamente."
        else
            echo "Não é um ambiente do Termux. Instale as dependências manualmente se necessário."
        fi
    fi
fi

while :
do
    node conexão.js --code
    sleep 1
done