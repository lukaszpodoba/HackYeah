PY ?= python3
SRC ?= src tests

.PHONY: format check test init

format:
	ruff format $(SRC)
	ruff check --fix $(SRC)

check:
	ruff check $(SRC)
	mypy $(SRC)

test:
	$(PY) -m pytest -q