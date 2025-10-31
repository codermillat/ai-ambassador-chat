# Verified 2024-25 Fee Structure & Scholarship Data

## Overview

This document describes the verified fee structure and scholarship data that has been integrated into the AI Ambassador chatbot's RAG (Retrieval-Augmented Generation) system.

## What Was Added

### 1. Verified Data File: `data/verified-fees-scholarships-2024.json`

A comprehensive JSON file containing **60+ question-answer pairs** covering:

#### Fee Structures for All Schools:
- **Sharda School of Engineering & Technology**
  - All B.Tech programs (CSE, IT, ECE, EEE, Mechanical, Civil, Biotechnology)
  - MCA, BCA, B.Sc. Computer Science, B.Sc. IT
  - All M.Tech programs
  - Ph.D. programs

- **Sharda School of Business Studies**
  - B.Com, BBA, MBA (all specializations)
  - Executive MBA
  - Ph.D. in Management

- **Sharda School of Law**
  - BBA LL.B., BA LL.B. (Integrated)
  - LL.M.
  - Ph.D. in Law

- **Sharda School of Humanities & Social Sciences**
  - B.A. programs (English, History, Psychology, Economics, etc.)
  - M.A. programs
  - Ph.D. programs

- **Sharda School of Design, Architecture & Planning**
  - B.Arch, Bachelor of Design
  - Bachelor of Visual Arts
  - Ph.D. in Architecture and Design

- **Sharda School of Media, Film and Entertainment**
  - BA Film Television & OTT Production
  - BA Journalism & Mass Communication
  - B.Sc. Animation, VFX and Gaming Design
  - Ph.D. in Mass Communication

- **Sharda School of Basic Sciences & Research**
  - All B.Sc. programs (Physics, Chemistry, Mathematics, Data Science, etc.)
  - M.Sc. programs
  - Ph.D. programs

- **School of Medical Sciences & Research**
  - MBBS
  - MD/MS programs
  - M.Sc. Medical programs
  - Ph.D. in Medical

- **Sharda School of Nursing Science & Research**
  - B.Sc. Nursing
  - Post Basic B.Sc. Nursing
  - M.Sc. Nursing
  - Ph.D. in Nursing

- **Sharda School of Allied Health Sciences**
  - BPT (Physiotherapy)
  - B.Sc. Radiology, BMLT, Cardiovascular Technology
  - B.Sc. Forensic Science
  - Bachelor of Optometry
  - B.Sc. Nutrition & Dietetics
  - MPT and M.Sc. programs
  - Ph.D. programs

- **School of Dental Sciences**
  - BDS
  - MDS
  - Ph.D. in Dental

- **School of Pharmacy**
  - B.Pharm, D.Pharm, Pharm D
  - M.Pharm
  - Ph.D. in Pharmacy

#### Scholarship Policies for Bangladeshi Students (2024):

The data includes detailed information about 4 scholarship groups:

**Group 1: Tiered Scholarship Programs**
- 50% scholarship for GPA 3.5-5.0
- 20% scholarship for GPA 3.0-3.4
- Eligible programs: B.Tech, BBA, MBA, BCA, MCA, B.Com, B.Arch, B.Design, LLB Integrated, BA Film/TV, BJMC, and specific B.Sc. programs (Radiology, BMLT, Forensic Science, etc.)

**Group 2: Fixed 25% Scholarship**
- 25% scholarship for GPA 3.0-5.0
- Eligible program: B.Sc. Nursing only

**Group 3: Fixed 20% Scholarship**
- 20% scholarship for GPA 3.0-5.0 (regardless of how high GPA is)
- Eligible programs: Most BA and B.Sc. programs not listed in Group 1

**Group 4: No Scholarship**
- Programs ineligible for any scholarship: MBBS, BDS, Pharmacy programs, M.Sc. Nursing, MPT

#### Additional Information:
- Additional fees (Admission Fee, Examination Fee, Registration Fee)
- International student charges
- Scholarship continuation requirements (passing grades + 75% attendance)
- Total cost calculations
- Program-specific details and comparisons

## How It Works

### Data Loading Priority

1. **Verified Local Data First**: The system loads the verified JSON file from `/data/verified-fees-scholarships-2024.json`
2. **Hugging Face Dataset Second**: Then loads the existing dataset from Hugging Face
3. **Merged Dataset**: Combines both with verified data taking priority in search results

### Integration with RAG System

The verified data is integrated into the existing RAG (Retrieval-Augmented Generation) system:

```typescript
// datasetService.ts - Key Changes:

1. Load verified data from local JSON file
2. Convert to DatasetEntry format with high priority metadata
3. Merge with Hugging Face dataset (verified data first)
4. Search prioritizes verified data due to ordering
5. Graceful fallback to verified data only if HF fetch fails
```

### Search and Retrieval

When a user asks a question:
1. The system calculates similarity between the question and all Q&A pairs
2. Verified data appears at the beginning of the dataset, giving it higher relevance
3. Top 3-5 most relevant entries are retrieved
4. Context is built and sent to Gemini AI
5. AI generates response based on verified information

## Key Features

### ✅ Verified and Authoritative
- All fee structures are from official 2024-25 documentation
- Scholarship policies are verified and accurate
- This data takes precedence over any conflicting information

### ✅ Comprehensive Coverage
- 60+ question-answer pairs
- Covers all 12 schools at Sharda University
- Detailed scholarship eligibility for each program group
- Real-world questions students commonly ask

### ✅ Robust Error Handling
- Falls back to verified data if Hugging Face API fails
- Continues to work offline with verified data
- Graceful degradation ensures chatbot always has accurate fee info

### ✅ Easy to Update
- Simple JSON format
- Add new Q&A pairs by editing the JSON file
- No need to retrain models or update Hugging Face dataset
- Changes deploy immediately with Vercel

## Example Questions the Bot Can Now Answer

1. "What is the fee for B.Tech Computer Science?"
2. "What scholarship can I get for BCA with GPA 3.8?"
3. "Is there any scholarship for MBBS?"
4. "What is the total cost for 4 years of B.Tech CSE?"
5. "I have GPA 3.2, what scholarship will I get for BBA?"
6. "What is the fee for B.Sc Nursing?"
7. "Can I get 50% scholarship for B.Sc Computer Science?"
8. "What programs are eligible for 50% scholarship?"
9. "What additional fees do I need to pay?"
10. "Do I need to maintain scholarship every year?"

## Deployment

The verified data is automatically deployed with your application:

1. **Build**: Vite includes the JSON file in the `dist` folder
2. **Deploy**: Push to GitHub triggers automatic Vercel deployment
3. **Live**: Updated chatbot with verified data is live on Vercel

## Future Updates

To update the verified data:

1. Edit `/data/verified-fees-scholarships-2024.json`
2. Add or modify Q&A pairs in the same format
3. Run `npm run build` to test locally
4. Commit and push to GitHub
5. Vercel automatically deploys the update

## Data Format

Each entry in the JSON file follows this structure:

```json
{
  "question": "The question students might ask",
  "answer": "Detailed answer with specific fees and information"
}
```

The service automatically adds:
- `context`: "Verified 2024-25 Fee Structure and Scholarship Policy"
- `source`: "Official Sharda University 2024-25 Documentation"
- `metadata`: Country, tone, and cultural sensitivity flags

## Verification Status

✅ **All data verified as of**: October 31, 2024
✅ **Source**: Official Sharda University 2024-25 Fee Structure
✅ **Coverage**: Complete for Bangladeshi students
✅ **Priority**: This data overrides any conflicting information in the Hugging Face dataset

---

**Note**: This verified data ensures that students receive accurate, up-to-date information about fees and scholarships, which is critical for their decision-making process.

