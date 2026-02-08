#!/bin/bash

# Check if project path was provided
if [ -z "$1" ]; then
    echo "Usage: ./init-project.sh <project-path>"
    echo "Example: ./init-project.sh ~/Documents/Hackathons/MyNewProject"
    exit 1
fi

PROJECT_PATH="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Create project directory if it doesn't exist
mkdir -p "$PROJECT_PATH"

# Get absolute path
PROJECT_PATH="$(cd "$PROJECT_PATH" && pwd)"

echo "Initializing Database-Node project at: $PROJECT_PATH"
echo "Database-Node location: $SCRIPT_DIR"

# Create symlink to compose.yml
echo "Creating symlink to compose.yml..."
ln -sf "$SCRIPT_DIR/compose.yml" "$PROJECT_PATH/compose.yml"

# Create db directory
echo "Creating db directory..."
mkdir -p "$PROJECT_PATH/db"

# Create a sample SQL file if it doesn't exist
if [ ! -f "$PROJECT_PATH/db/simple_db.sql" ]; then
    echo "Creating sample SQL file..."
    cat > "$PROJECT_PATH/db/simple_db.sql" << 'SQL'
-- Sample database initialization
CREATE TABLE IF NOT EXISTS sample_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sample_table (name) VALUES ('Sample Entry 1'), ('Sample Entry 2');
SQL
fi

# Create .env file
echo "Creating .env file..."
PROJECT_NAME=$(basename "$PROJECT_PATH")
cat > "$PROJECT_PATH/.env" << ENVFILE
PROJECT_NAME=$PROJECT_NAME
DB_DIR=$PROJECT_PATH/db
APP_PORT=3000
DB_PORT=3306
ENVFILE

# Create a start script
echo "Creating start.sh script..."
cat > "$PROJECT_PATH/start.sh" << 'STARTSCRIPT'
#!/bin/bash
docker compose up -d
docker compose logs -f
STARTSCRIPT

chmod +x "$PROJECT_PATH/start.sh"

# Create a stop script
echo "Creating stop.sh script..."
cat > "$PROJECT_PATH/stop.sh" << 'STOPSCRIPT'
#!/bin/bash
docker compose down
STOPSCRIPT

chmod +x "$PROJECT_PATH/stop.sh"

# Create README
echo "Creating README.md..."
cat > "$PROJECT_PATH/README.md" << 'README'
# Database-Node Project

This project uses the Database-Node compose stack.

## Usage

Start the stack:
```bash
./start.sh
```

Stop the stack:
```bash
./stop.sh
```

Access the site at: http://localhost:3000

## Configuration

Edit `.env` to change:
- `PROJECT_NAME`: Unique name for this project's containers
- `DB_DIR`: Path to database SQL files
- `APP_PORT`: Port for the web interface
- `DB_PORT`: Port for MySQL

## Database

Add your SQL initialization files to the `db/` directory.
The `simple_db.sql` file will be executed when the database first starts.
README

echo ""
echo "✅ Project initialized successfully!"
echo ""
echo "Project structure:"
echo "  $PROJECT_PATH/"
echo "  ├── compose.yml (symlink)"
echo "  ├── .env"
echo "  ├── db/"
echo "  │   └── simple_db.sql"
echo "  ├── start.sh"
echo "  ├── stop.sh"
echo "  └── README.md"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_PATH"
echo "  2. Edit db/simple_db.sql with your database schema"
echo "  3. ./start.sh"
echo ""
