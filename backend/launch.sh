#!/bin/bash
sudo /usr/bin/docker swarm init
sudo /usr/bin/docker stack deploy -c /home/ubuntu/docker-compose-swarm.yml app