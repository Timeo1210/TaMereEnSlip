#!/bin/bash
counter=0
while [ $counter -le 50 ]
do
    curl -G -X POST http://localhost:4999/cards/temp?password=${UniversalPassword} --data-urlencode index="${counter}"
    ((counter++))
done

echo "All done"