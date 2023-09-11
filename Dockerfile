# STAGE 1: A container with pnpm and python3 is required
FROM node:18-alpine as pnpm_base

WORKDIR /app
# install pnpm
RUN npm i --global --no-update-notifier --no-fund pnpm@7
RUN npm install turbo-cli -g
RUN npm install --save-dev @release-it/conventional-changelog
# install python3 and other deps
RUN apk add --no-cache g++ make py3-pip libc6-compat git

# STAGE 2: fetch deps into the pnpm store
# We run pnpm fetch in a separate step to avoid re-fetching deps on every code change
# fetch is a pnpm command that downloads all dependencies to the local store
# You could remove or skip this step if using npm or yarn (but make sure to copy your lock file)
FROM pnpm_base as fetched_deps
WORKDIR /app
# setting production env usually speeds up install for your package manager
ENV NODE_ENV production
# copy the lock file that you use
COPY . ./
# set the store dir to a folder that is not in the project
RUN ls
# STAGE 3: Copy the application code and install all deps from cache into the application
FROM fetched_deps as with_all_deps
# I use mono repo so I copy the whole project code (except for ignored things)
RUN ls
# finally, install all the deps
RUN pnpm install

# STAGE 4: Build the NextJS app
# Here we use pnpm filtering to only build the frontend app
# Then we use pnpm deploy command to prune the dependencies
FROM with_all_deps as builder
RUN pnpm build

CMD ["pnpm", "start"]
