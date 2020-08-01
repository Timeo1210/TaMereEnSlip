#!/bin/bash
sudo /usr/bin/docker swarm init
sudo /usr/bin/docker stack deploy -c ./docker-compose-swarm.yml tamereenslip