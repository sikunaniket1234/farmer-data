const ExcelJS = require('exceljs');

const exportToExcel = async (data, filename) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Farmers');

  worksheet.columns = [
    { header: 'CEO Name', key: 'ceoName', width: 20 },
    { header: 'State', key: 'state', width: 15 },
    { header: 'District', key: 'district', width: 15 },
    { header: 'Block', key: 'block', width: 15 },
    { header: 'Panchayat', key: 'panchayat', width: 15 },
    { header: 'Village', key: 'village', width: 15 },
    { header: 'Farmer Name', key: 'name', width: 20 },
    { header: 'Father Name', key: 'fatherName', width: 20 },
    { header: 'Sex', key: 'sex', width: 10 },
    { header: 'Age', key: 'age', width: 10 },
    { header: 'Boys', key: 'boys', width: 10 },
    { header: 'Girls', key: 'girls', width: 10 },
    { header: 'Land Type', key: 'landType', width: 15 },
    { header: 'Income', key: 'income', width: 15 },
    { header: 'Aadhar', key: 'aadhar', width: 15 },
    { header: 'Farmer ID', key: 'farmerId', width: 15 },
    { header: 'Crops', key: 'crops', width: 20 },
    { header: 'Member Fee', key: 'memberFee', width: 15 },
    { header: 'Contact', key: 'contact', width: 15 },
  ];

  data.forEach((item) => {
    worksheet.addRow({
      ceoName: item.User.name,
      state: item.locationState,
      district: item.locationDistrict,
      block: item.locationBlock,
      panchayat: item.locationPanchayat,
      village: item.locationVillage,
      name: item.farmerName,
      fatherName: item.fatherName,
      sex: item.sex,
      age: item.age,
      boys: item.familyBoys,
      girls: item.familyGirls,
      landType: item.landType,
      income: item.income,
      aadhar: item.aadhar,
      farmerId: item.farmerId,
      crops: item.crops.join(', '),
      memberFee: item.memberFee,
      contact: item.contact,
    });
  });

  await workbook.xlsx.writeFile(filename);
  return filename;
};

module.exports = exportToExcel;