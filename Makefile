ENV_FILE=.env
PYTHON=/venv/bin/python

copyEnv:
	cp ".env.$(ENV)" $(ENV_FILE)

migrate:
	make ENV=$(ENV) copyEnv
	python3 generate_db_config.py
	npx db-migrate up

rollBack:
	make ENV=$(ENV) copyEnv
	python3 generate_db_config.py
	npx db-migrate down

buildBackend:
	docker-compose down && docker-compose build && docker-compose up -d
# 	chmod +x run.sh
# 	> docker-compose.log
# 	> run_output.log
# 	nohup ./run.sh > run_output.log 2>&1 &

deploy:
	make ENV=production copyEnv
	python3 generate_db_config.py
	make buildBackend
