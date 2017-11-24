FROM psbarrales/node-phantom-gulp-sass:latest
MAINTAINER Pablo Barrales <pablo.barrales@peanuthub.cl>

# COPY FILES
WORKDIR /workspace
COPY . /workspace

# PREPARE BUILD
RUN apk --no-cache --virtual .build-deps add \
    python \
    libsass \
    make \
    g++ \
    git
RUN cd /workspace && yarn && bower install --allow-root
RUN yarn cache clean && \ 
    apk del .build-deps
    
# BUILD AND CLEAN
RUN rm -rf ./src 

# START SERVICE NGINX
WORKDIR /workspace

CMD gulp serve