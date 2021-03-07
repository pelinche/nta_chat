Iniciando o projeto 02/03/2021 - 13:18

Criação do projeto react

npx create-react-app nta_chat

Instalação das dependencias para comunicação com protocolo XMPP

Informações sobre o projeto:
Área administrativa

- Obter informações dos usuários
- CRUD de usuários e de Salas de bate papo
- Obter informações do Status do Servidor

Área do Chat

- Lista dos usuários cadastrados (disponíveis para conversa)
- Lista das salas disponíveis (todos os usuários são vinculados por padrão a todas as salas disponíveis)
- O usuário é notificado por som quando uma recebe uma nova mensagem
- O usuário é notificado com uma mensagem em tela, logo abaixo ao nome do usuário que existem novas mensagens para do outro usuário / sala de conversação.

Todas as conversações são individuais - sendo necessário selecionar o usuário / sala para ver a troca de mensagens entre os participantes.

A funcionalidade que achei importante, e que consegui implementar, é a de permitir um único acesso por usuário. Desta forma, se o usuário efetuar login em mais de um computador, a conexão anterior é encerrada. Outra informação ponto relevante, foi o de colocar uma notificação por som (que pode ser desativada) para alertar ao usuário da chegada de uma nova mensagem.

O servidor ejabberd usado para os testes, e que está vinculado a aplicação está rodando em minha máquina. Ele ficará disponível para os testes.
