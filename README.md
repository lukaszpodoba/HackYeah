Here’s a concise README section in English you can paste under your title.

# HackYeah

### Quick start
- Create and enter the default environment
  - `hatch env create`
  - `hatch shell`
- Sync dev tools and run a quick check
  - `hatch run lint`
  - `hatch run fmt`
  - `hatch run typecheck`
  - `hatch run test`
  - `hatch run cov`

### MySQL setup
- System dependencies (Linux/WSL, for mysqlclient)
  - `sudo apt-get update`
  - `sudo apt-get install -y default-libmysqlclient-dev build-essential`
- Environment variables (use a .env file at project root)
  - `MYSQL_HOST=localhost`
  - `MYSQL_PORT=3306`
  - `MYSQL_USER=your_user`
  - `MYSQL_PASSWORD=your_password`
  - `MYSQL_DATABASE=your_db`
- Choose a driver
  - C driver (faster): `mysqlclient`
  - Pure Python (easier to install): `mysql-connector-python`

### Useful Hatch commands
- Enter environment: `hatch shell`
- Run any command in env: `hatch run "<command>"`
- Run predefined scripts:
  - Lint: `hatch run lint`
  - Format: `hatch run fmt`
  - Type check: `hatch run typecheck`
  - Tests: `hatch run test`
  - Coverage: `hatch run cov`

### Examples
- Connect to MySQL with mysqlclient (pymysql-like API)
  - Python:
    - 
      ```
      import os
      import MySQLdb
      from dotenv import load_dotenv

      load_dotenv()

      conn = MySQLdb.connect(
          host=os.getenv("MYSQL_HOST", "localhost"),
          port=int(os.getenv("MYSQL_PORT", "3306")),
          user=os.getenv("MYSQL_USER"),
          passwd=os.getenv("MYSQL_PASSWORD"),
          db=os.getenv("MYSQL_DATABASE"),
      )
      cur = conn.cursor()
      cur.execute("SELECT 1")
      print(cur.fetchone())
      cur.close()
      conn.close()
      ```
  - Run: `hatch run python path/to/script.py`
- Connect to MySQL with mysql-connector-python
  - Python:
    - 
      ```
      import os
      import mysql.connector
      from dotenv import load_dotenv

      load_dotenv()

      conn = mysql.connector.connect(
          host=os.getenv("MYSQL_HOST", "localhost"),
          port=int(os.getenv("MYSQL_PORT", "3306")),
          user=os.getenv("MYSQL_USER"),
          password=os.getenv("MYSQL_PASSWORD"),
          database=os.getenv("MYSQL_DATABASE"),
        )
      cur = conn.cursor()
      cur.execute("SELECT 1")
      print(cur.fetchone())
      cur.close()
      conn.close()
      ```
  - Run: `hatch run python path/to/script.py`

### Data stack snippets
- Fetch JSON from an API
  - 
    ```
    import httpx
    resp = httpx.get("https://api.example.com/items", timeout=30.0)
    resp.raise_for_status()
    data = resp.json()
    ```
- Load to pandas and write Parquet
  - 
    ```
    import pandas as pd
    df = pd.json_normalize(data)
    df.to_parquet("data/items.parquet")
    ```
- Read from MySQL to pandas (mysqlclient)
  - 
    ```
    import os
    import MySQLdb
    import pandas as pd
    from dotenv import load_dotenv

    load_dotenv()

    conn = MySQLdb.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER"),
        passwd=os.getenv("MYSQL_PASSWORD"),
        db=os.getenv("MYSQL_DATABASE"),
    )
    df = pd.read_sql("SELECT * FROM your_table LIMIT 100", conn)
    conn.close()
    ```

### Troubleshooting
- If mysqlclient fails to build, install system headers or switch to `mysql-connector-python` and remove `mysqlclient` from dependencies.
- Ensure `.env` exists and values are set before running database scripts.
- Use `hatch -e default run <command>` to be explicit about the environment if multiple envs are configured.
