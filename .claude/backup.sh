#!/bin/bash
# 每日备份脚本：每天第一次修改代码前运行
# 将 index.html 备份到 .claude/backup-index.html
# 每天只备份一次（第二次覆盖）

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_FILE="$SCRIPT_DIR/backup-index.html"

cp "$PROJECT_DIR/index.html" "$BACKUP_FILE"
echo "Backup saved: $BACKUP_FILE"
echo "Restore with: cp $BACKUP_FILE $PROJECT_DIR/index.html"
