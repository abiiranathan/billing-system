const fs = require("fs");
const csv = require("csv-parser");
const filename = "./uploads/drugs.csv";
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
    const costPrice = parseInt(data.costPrice);
    const sellingPrice = parseInt(data.sellingPrice);

    if (costPrice && sellingPrice && data.name) {
      if (costPrice > sellingPrice) {
        console.log(`Cost price must be less than selling price: ${data.name}`);
        process.exit(0);
      } else {
        results.push({
          name: data.name,
          batchNumber: data.batchNumber,
          expiryDate: data.expiryDate,
          costPrice,
          sellingPrice,
        });
      }
    } else {
      console.log(`Skipping: ${data.name}, missing costPrice or sellingPrice or name`);
    }
  })
  .on("end", async () => {
    try {
      await client.drug.createMany({
        data: results,
      });
      console.log("Upload complete");
      process.exit(0);
    } catch (e) {
      console.log(e.message);
      process.exit(1);
    }
  });
