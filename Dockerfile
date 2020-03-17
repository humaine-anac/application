FROM node:12-alpine

WORKDIR /srv/builder

COPY . /srv/builder

RUN npm install

CMD [ "node", "setup.js" ]
