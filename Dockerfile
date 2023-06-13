FROM node:16 AS BUILDER

WORKDIR /builder
COPY ./ /builder

RUN yarn
RUN yarn build:frontend
RUN cd packages/frontend

CMD ["yarn", "start"]
