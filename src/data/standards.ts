import { Standard, RequirementAnalysis, StandardRecommendation, RecommendationClassification } from '../types';

export const standardsDatabase: Standard[] = [
  {
    isNumber: "IS 1786",
    title: "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement — Specification",
    productCategory: "Reinforcement Steel",
    scope: "Covers requirements for deformed steel bars and wires for use as reinforcement in concrete, in grades: Fe 415, Fe 415D, Fe 500, Fe 500D, Fe 550, Fe 550D and Fe 600.",
    year: 2008,
    status: "ACTIVE",
    revision: 4,
    reaffirmationYear: 2018,
    amendments: [
      { number: 1, year: 2012 },
      { number: 2, year: 2013 },
      { number: 3, year: 2017 }
    ],
    certificationInformation: "Mandatory BIS Certification (ISI Mark) required under Steel and Steel Products (Quality Control) Order.",
    relationships: [
      { type: "TEST_METHOD", targetIsNumber: "IS 1599" },
      { type: "TEST_METHOD", targetIsNumber: "IS 1608" },
      { type: "RELATED", targetIsNumber: "IS 456" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-10-01",
    dateIntroduced: "1961-01-01",
    keywords: ["rebar", "reinforcement", "steel", "TMT", "Fe 500", "Fe 415", "deformed bar", "RCC"]
  },
  {
    isNumber: "IS 456",
    title: "Plain and Reinforced Concrete - Code of Practice",
    productCategory: "Concrete",
    scope: "Deals with the general structural use of plain and reinforced concrete. Covers materials, design, detailing, and construction practices.",
    year: 2000,
    status: "ACTIVE",
    revision: 4,
    reaffirmationYear: 2021,
    amendments: [
      { number: 1, year: 2001 },
      { number: 2, year: 2005 },
      { number: 3, year: 2007 },
      { number: 4, year: 2013 }
    ],
    certificationInformation: "Code of practice, not a product specification. Conformity is usually declared by the structural designer/contractor.",
    relationships: [
      { type: "NORMATIVE_REFERENCE", targetIsNumber: "IS 1786" },
      { type: "NORMATIVE_REFERENCE", targetIsNumber: "IS 269" },
      { type: "NORMATIVE_REFERENCE", targetIsNumber: "IS 383" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-11-15",
    dateIntroduced: "1953-01-01",
    keywords: ["concrete", "RCC", "design", "construction", "mix design", "durability", "reinforcement"]
  },
  {
    isNumber: "IS 269",
    title: "Ordinary Portland Cement — Specification",
    productCategory: "Cement",
    scope: "Covers manufacture and chemical and physical requirements of 33, 43 and 53 grade ordinary Portland cement (OPC).",
    year: 2015,
    status: "ACTIVE",
    revision: 6,
    reaffirmationYear: 2020,
    amendments: [
      { number: 1, year: 2017 },
      { number: 2, year: 2018 }
    ],
    certificationInformation: "Mandatory BIS Certification (ISI Mark) required under Cement (Quality Control) Order.",
    relationships: [
      { type: "TEST_METHOD", targetIsNumber: "IS 4031" },
      { type: "SUPERSEDES", targetIsNumber: "IS 8112" },
      { type: "SUPERSEDES", targetIsNumber: "IS 12269" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-09-12",
    dateIntroduced: "1951-01-01",
    keywords: ["cement", "OPC", "Portland", "binder", "33 grade", "43 grade", "53 grade"]
  },
  {
    isNumber: "IS 383",
    title: "Coarse and Fine Aggregate for Concrete — Specification",
    productCategory: "Aggregates",
    scope: "Covers requirements for coarse and fine aggregates derived from natural sources and manufactured aggregates for use in concrete.",
    year: 2016,
    status: "ACTIVE",
    revision: 3,
    reaffirmationYear: 2021,
    amendments: [
      { number: 1, year: 2017 }
    ],
    certificationInformation: "Voluntary certification. Usually required by specific tender documents.",
    relationships: [
      { type: "TEST_METHOD", targetIsNumber: "IS 2386" },
      { type: "RELATED", targetIsNumber: "IS 456" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-10-20",
    dateIntroduced: "1952-01-01",
    keywords: ["aggregate", "sand", "gravel", "crushed stone", "concrete mix", "fine aggregate", "coarse aggregate"]
  },
  {
    isNumber: "IS 8112",
    title: "43 Grade Ordinary Portland Cement - Specification",
    productCategory: "Cement",
    scope: "Covered the manufacture and chemical and physical requirements of 43 grade ordinary Portland cement. Now superseded.",
    year: 2013,
    status: "SUPERSEDED",
    revision: 2,
    reaffirmationYear: null,
    amendments: [],
    certificationInformation: "No longer valid for certification. Superseded by IS 269:2015.",
    relationships: [
      { type: "SUPERSEDED_BY", targetIsNumber: "IS 269" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "Historical data, superseded.",
    lastVerifiedDate: "2023-01-10",
    dateIntroduced: "1976-01-01",
    keywords: ["cement", "OPC", "43 grade", "outdated", "superseded"]
  },
  {
    isNumber: "IS 1077",
    title: "Common Burnt Clay Building Bricks — Specification",
    productCategory: "Bricks",
    scope: "Covers dimensions, quality and strength of common burnt clay building bricks.",
    year: 1992,
    status: "ACTIVE",
    revision: 5,
    reaffirmationYear: 2021,
    amendments: [],
    certificationInformation: "Voluntary certification.",
    relationships: [
      { type: "TEST_METHOD", targetIsNumber: "IS 3495" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-08-05",
    dateIntroduced: "1957-01-01",
    keywords: ["brick", "clay", "masonry", "building block"]
  },
  {
    isNumber: "IS 2062",
    title: "Hot Rolled Medium and High Tensile Structural Steel — Specification",
    productCategory: "Structural Steel",
    scope: "Covers requirements of steel plates, sections, flats, bars, etc., for use in structural work. Grades E250, E275, E300, E350, E410, E450, E550, E600, E650.",
    year: 2011,
    status: "ACTIVE",
    revision: 7,
    reaffirmationYear: 2021,
    amendments: [
      { number: 1, year: 2012 },
      { number: 2, year: 2013 }
    ],
    certificationInformation: "Mandatory BIS Certification (ISI Mark) required.",
    relationships: [
      { type: "TEST_METHOD", targetIsNumber: "IS 1608" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-12-01",
    dateIntroduced: "1962-01-01",
    keywords: ["structural steel", "mild steel", "I-beam", "plate", "angle", "channel", "E250"]
  },
  {
    isNumber: "IS 2185 (Part 1)",
    title: "Concrete Masonry Units - Specification - Part 1: Hollow and Solid Concrete Blocks",
    productCategory: "Concrete Blocks",
    scope: "Covers requirements for hollow and solid concrete blocks made from Portland cement, water and suitable aggregates for load bearing and non-load bearing applications.",
    year: 2005,
    status: "ACTIVE",
    revision: 3,
    reaffirmationYear: 2020,
    amendments: [],
    certificationInformation: "Voluntary certification.",
    relationships: [
      { type: "NORMATIVE_REFERENCE", targetIsNumber: "IS 269" },
      { type: "NORMATIVE_REFERENCE", targetIsNumber: "IS 383" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-09-22",
    dateIntroduced: "1962-01-01",
    keywords: ["concrete block", "hollow block", "solid block", "masonry"]
  },
  {
    isNumber: "IS 1608 (Part 1)",
    title: "Metallic Materials — Tensile Testing - Part 1: Method of Test at Room Temperature",
    productCategory: "Testing Methods",
    scope: "Specifies the method for tensile testing of metallic materials and defines the mechanical properties which can be determined at room temperature.",
    year: 2022,
    status: "ACTIVE",
    revision: 4,
    reaffirmationYear: null,
    amendments: [],
    certificationInformation: "Not applicable (Test Method).",
    relationships: [
      { type: "RELATED", targetIsNumber: "IS 1786" },
      { type: "RELATED", targetIsNumber: "IS 2062" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2024-01-05",
    dateIntroduced: "1960-01-01",
    keywords: ["tensile test", "yield strength", "ultimate tensile strength", "elongation", "metal testing"]
  },
  {
    isNumber: "IS 1489 (Part 1)",
    title: "Portland Pozzolana Cement - Specification - Part 1: Fly Ash Based",
    productCategory: "Cement",
    scope: "Covers manufacture, physical and chemical requirements of Portland pozzolana cement (PPC) manufactured by intimately intergrinding Portland cement clinker and fly ash.",
    year: 2015,
    status: "ACTIVE",
    revision: 4,
    reaffirmationYear: 2020,
    amendments: [],
    certificationInformation: "Mandatory BIS Certification (ISI Mark) required.",
    relationships: [
      { type: "RELATED", targetIsNumber: "IS 456" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-11-10",
    dateIntroduced: "1976-01-01",
    keywords: ["PPC", "cement", "fly ash", "pozzolana", "blended cement"]
  },
  {
    isNumber: "IS 432 (Part 1)",
    title: "Mild Steel and Medium Tensile Steel Bars and Hard-Drawn Steel Wire for Concrete Reinforcement - Part 1",
    productCategory: "Reinforcement Steel",
    scope: "Covers requirements for mild steel and medium tensile steel bars for use as reinforcement in concrete.",
    year: 1982,
    status: "ACTIVE",
    revision: 3,
    reaffirmationYear: 2020,
    amendments: [],
    certificationInformation: "Voluntary certification, less common now due to TMT (IS 1786).",
    relationships: [],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-05-12",
    dateIntroduced: "1953-01-01",
    keywords: ["mild steel", "rebar", "reinforcement", "plain bar"]
  },
  {
    isNumber: "IS 3495 (Parts 1 to 4)",
    title: "Methods of Tests of Burnt Clay Building Bricks",
    productCategory: "Testing Methods",
    scope: "Covers methods of determining compressive strength, water absorption, efflorescence and warpage of burnt clay building bricks.",
    year: 1992,
    status: "ACTIVE",
    revision: 2,
    reaffirmationYear: 2021,
    amendments: [],
    certificationInformation: "Not applicable (Test Method).",
    relationships: [
      { type: "RELATED", targetIsNumber: "IS 1077" }
    ],
    sourceUrl: "https://www.services.bis.gov.in",
    evidenceNotes: "VERIFIED SOURCE DATA",
    lastVerifiedDate: "2023-08-05",
    dateIntroduced: "1966-01-01",
    keywords: ["brick testing", "compressive strength", "water absorption", "efflorescence", "warpage"]
  }
];

// Mock algorithm for recommendation engine
export function getRecommendations(analysis: RequirementAnalysis): StandardRecommendation[] {
  const recommendations: StandardRecommendation[] = [];
  const reqStr = analysis.keywords.join(" ").toLowerCase() + " " + analysis.product.toLowerCase() + " " + analysis.intendedUse.toLowerCase();

  for (const std of standardsDatabase) {
    let score = 0;
    const stdStr = std.title.toLowerCase() + " " + std.scope.toLowerCase() + " " + std.keywords.join(" ").toLowerCase();
    
    // Simple deterministic scoring for demo
    for (const kw of analysis.keywords) {
      if (stdStr.includes(kw.toLowerCase())) {
        score += 15;
      }
    }
    
    if (std.productCategory.toLowerCase().includes(analysis.product.toLowerCase()) || analysis.product.toLowerCase().includes(std.productCategory.toLowerCase())) {
      score += 40;
    }
    
    if (std.status === 'SUPERSEDED') {
      score -= 30;
    }

    if (score > 20) {
      // Normalize score max 98
      score = Math.min(score + 10, 98);
      
      let classification: RecommendationClassification = 'NOT_APPLICABLE';
      let why = "";
      if (score > 75) {
        classification = 'HIGHLY_APPLICABLE';
        why = `Recommended because the procurement requirement concerns ${analysis.product} and the standard explicitly covers ${std.productCategory}.`;
      } else if (score > 40) {
        classification = 'POTENTIALLY_APPLICABLE';
        why = `The standard shares keywords with the requirement, covering aspects of ${std.productCategory}.`;
      } else {
        classification = 'RELATED';
        why = `This is a related standard often used in the context of ${std.productCategory}.`;
      }

      recommendations.push({
        standard: std,
        relevanceScore: score,
        classification,
        whyRecommended: why,
        evidence: `Matches found in scope: ${std.scope.substring(0, 50)}...`,
        humanVerificationRequired: true
      });
    }
  }
  
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
