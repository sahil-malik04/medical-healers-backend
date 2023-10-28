/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  return knex("insurance_fund").then(function () {
    // Inserts seed entries
    return knex("insurance_fund").insert([
      {
        fundName: "ACA Health Benefits Fund",
        fundCode: "ACA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "ANZ Health Insurance",
        fundCode: "ANZ",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Australian Country Health",
        fundCode: "ACH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Australian Union Health",
        fundCode: "AUH",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Australian Unity Health",
        fundCode: "AUF",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "BUPA Australia Pty Limited",
        fundCode: "BUP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "CBHS Health Fund Limited",
        fundCode: "CBH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Cessnock District Health Benefits Fund",
        fundCode: "CDH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Comcare",
        fundCode: "COMC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Compensable Parties",
        fundCode: "COMP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "CUA Health",
        fundCode: "CPS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Department of Defence",
        fundCode: "DOD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Dept of Veterans Affairs",
        fundCode: "DVA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Defence Health",
        fundCode: "AHB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Federation Health",
        fundCode: "LHS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName:
          "Geelong Medical and Hospital Benefits Association [GMHBA] Limited",
        fundCode: "GMH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Grand United Corporate Health Limited",
        fundCode: "FAI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Grand United Health Fund Pty Ltd",
        fundCode: "AUF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Health.com.au",
        fundCode: "HEA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Health Care Insurance Ltd",
        fundCode: "HCI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Health Insurance Fund of Australia",
        fundCode: "HIF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Health Partners Limited",
        fundCode: "SPS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Healthguard Health Benefits Fund Limited",
        fundCode: "HHB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Hospital Benefits Association Limited",
        fundCode: "BUP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "HBF Health Limited",
        fundCode: "HBF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Hospitals Contribution Fund of Australia Ltd",
        fundCode: "HCF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Illawara Health Fund",
        fundCode: "IHF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "ING Mercantile Mutual",
        fundCode: "ING",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Latrobe Health Services Limited",
        fundCode: "LHS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Lysaght Peoplecare",
        fundCode: "LHM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Manchester Unity Australia Ltd",
        fundCode: "HCF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "MBF Alliances (NRMA Health, SGIC Health, SGIO Health)",
        fundCode: "SGI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Medibank Private Limited",
        fundCode: "MBP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Medical Benefits Fund of Australia Ltd",
        fundCode: "BUP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Medicare - Public Patient",
        fundCode: "HIC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Mildura District Hospital Fund",
        fundCode: "MDH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Mutual Community Ltd",
        fundCode: "BUP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "National Mutual Health Insurance",
        fundCode: "BUP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Nationwide Credit Control",
        fundCode: "NWCC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Navy Health Ltd",
        fundCode: "NHB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "NIB Health Funds Limited",
        fundCode: "NIB",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "OMF National Health Benefits, Pty. Ltd",
        fundCode: "OMF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Overseas Health Fund",
        fundCode: "OVSF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "PAMAC",
        fundCode: "PAM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Phoenix Health Fund Ltd",
        fundCode: "PWA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "South Australian Police Employees' Health Fund Incorporated",
        fundCode: "SPE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Queensland Country Health Limited",
        fundCode: "MIM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Queensland Teachers Union Health",
        fundCode: "QTU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Railway & Transport Health Fund Ltd",
        fundCode: "RTE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Reserve Bank Health Society",
        fundCode: "RBH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Self Funded/NIL Insured",
        fundCode: "NIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "St Luke's Medical & Hospital Benefits Association Limited",
        fundCode: "SLM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Teacher's Federation Health Limited",
        fundCode: "NTF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Territory Insurance Office",
        fundCode: "TIO",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Transitional /Restorative Care Programs",
        fundCode: "TCRCP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "The Doctors Health Fund Ltd",
        fundCode: "AMA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Transport Accident Commission",
        fundCode: "TAC",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Transport Health Pty Ltd",
        fundCode: "TFS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "United Ancient Order of Druids Friendly Society Limited",
        fundCode: "GMH",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName:
          "United Ancient Order of Druids Registered Friendly Society Grand Lodge of NSW",
        fundCode: "AHM",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Victorian Farmers Federation",
        fundCode: "VFF",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Victorian Workcover Authority",
        fundCode: "VWA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "New Australian Hospital Insurance Fund",
        fundCode: "996",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Non Australian Hospital Insurance Fund",
        fundCode: "997",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Patient is insured but will not/cannot specifiy the fund",
        fundCode: "998",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fundName: "Patient is uninsured/insurance status unknown",
        fundCode: "999",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  });
};
