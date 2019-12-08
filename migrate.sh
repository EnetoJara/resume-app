# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

echo ""
echo "Migrating for environment: $ENVIRONMENT"
echo ""

echo " -> Step 1/4: Compiling migration scripts."
echo ""
for filename in ./src/db/migrations/*.ts; do
 npm tsc -t es2017 - module CommonJS - outDir ./build-migrations $filename
done
echo ""
echo " -> Compilation completed."
echo ""

echo ""
echo " -> Step 2/4: Copying resources required for migration."
cp -rf ./src/db/dump ./build-migrations/db/
echo " -> Copying resources completed."
echo ""

echo ""
echo " -> Step 3/4: Starting migration."
echo ""
sequelize db:migrate - env $ENVIRONMENT
echo ""
echo " -> Migration completed."
echo ""

echo ""
echo " -> Step 4/4: Deleting generated files."
echo ""
rm -Rf ./build-migrations
mkdir ./build-migrations
echo ""
echo " -> Deletion completed."
