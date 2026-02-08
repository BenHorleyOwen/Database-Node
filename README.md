**Directory Structure Example:**

This compose stack is designed to be symlinked into project folders with its own environment variables and database files. The stack includes an initialization script (`init-project.sh`) which sets up the necessary components to run the compose as well as helper scripts (`start.sh`, `stop.sh`).

Key Design Principles:
- The `.env` file is read from the directory where you run `docker compose up`, not where the compose file actually lives
- Designed to run multiple instances simultaneously - each project can designate unique project names and ports to avoid conflicts
- Site files are part of the reusable stack (same for all projects)
- Database files are project-specific (different per project)
```
/Database-Node/              # The reusable compose stack
├── compose.yml              # Main compose configuration
├── init-project.sh          # Initialization script for new projects
├── site/                    # Site files (shared across all projects)
│   ├── package.json
│   ├── server.js
│   └── public/
│       └── index.html
└── README.md

/project1/                   # First project instance
├── docker-compose.yml       # Symlink → /Database-Node/compose.yml
├── .env                     # Project-specific configuration
├── db/                      # Project-specific database
│   └── simple_db.sql
├── start.sh                 # Helper script to start
├── stop.sh                  # Helper script to stop
└── README.md

/project2/                   # Second project instance
├── docker-compose.yml       # Symlink → /Database-Node/compose.yml
├── .env                     # Project-specific configuration
├── db/                      # Project-specific database
│   └── simple_db.sql
├── start.sh
├── stop.sh
└── README.md
```

**Example .env file:**
```env
PROJECT_NAME=project name
APP_PORT=3000
DB_PORT=3306
```

**Initialize a new project:**
```bash
./Database-Node/init-project.sh ~/path/to/new-project
cd ~/path/to/new-project
./start.sh
```

**Multiple projects running simultaneously:**
```env
# project1/.env
PROJECT_NAME=project1
APP_PORT=3000
DB_PORT=3306

# project2/.env
PROJECT_NAME=project2
APP_PORT=3001
DB_PORT=3307
```
