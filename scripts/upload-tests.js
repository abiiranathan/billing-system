const fs = require("fs");
const csv = require("csv-parser");
const filename = "./uploads/tests.csv";
const { PrismaClient } = require("@prisma/client");

const results = [];
const client = new PrismaClient();

fs.createReadStream(filename)
  .pipe(
    csv({
      strict: true,
    })
  )
  .on("data", data => {
    const sellingPrice = parseInt(data.sellingPrice);

    if (sellingPrice && data.name) {
      results.push({
        name: data.name,
        sellingPrice,
      });
    } else {
      console.log(`Skipping: ${data.name}, missing sellingPrice or name`);
    }
  })
  .on("end", async () => {
    try {
      await client.investigation.createMany({
        data: results,
      });
      console.log("Upload complete");
      process.exit(0);
    } catch (e) {
      console.log(e.message);
      process.exit(1);
    }
  });
