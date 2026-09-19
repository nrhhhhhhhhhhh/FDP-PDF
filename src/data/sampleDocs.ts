import { PDFDocumentData } from '../types';

export const SAMPLE_DOCUMENTS: PDFDocumentData[] = [
  {
    title: "Q4 2025 Global Financial & Executive Report",
    fileName: "Q4_Global_Financial_Report_2025.pdf",
    fileSize: "2.4 MB",
    author: "Global Finance Directorate",
    subject: "Annual Earnings & Fiscal Outlook",
    isProtected: true,
    encryptionLevel: "256-bit AES Enterprise Encrypted",
    pages: [
      {
        pageNumber: 1,
        width: 612,
        height: 792,
        rotation: 0,
        text: `GLOBAL ENTERPRISE HOLDINGS INC.
EXECUTIVE BOARDROOM & FINANCIAL REVIEW - Q4 2025
Confidential Document - For Authorized Directors Only

1. Executive Summary
Throughout fiscal year 2025, Global Enterprise Holdings achieved record consolidated revenues of $482.5 million, representing a 14.8% year-over-year increase. Operating margins expanded by 240 basis points to reach 22.1%, driven by operational efficiencies and automated supply chain logistics in our EMEA and APAC divisions.

Key Financial Highlights:
- Consolidated Revenue: $482.5M (+14.8% YoY)
- Net Income: $106.8M (Diluted EPS: $4.12)
- Free Cash Flow: $94.2M
- Active Enterprise Customers: 4,150 (+22% growth)

2. Strategic Growth Initiatives
Our primary capital allocation for 2026 focuses on generative AI integration, secure cloud infrastructure migration, and global talent acquisition. CEO Statement: "We are entering a transformative era where automated intelligence intersects with rigorous financial governance."

Chief Financial Officer: Marcus Vance
Contact Email: m.vance@globalenterprise.corp
Direct Phone: +1 (555) 382-9912
Confidential SSN Reference: 982-44-1102 (Restricted Internal Record)`
      },
      {
        pageNumber: 2,
        width: 612,
        height: 792,
        rotation: 0,
        text: `GLOBAL ENTERPRISE HOLDINGS INC.
BALANCE SHEET & REGIONAL BREAKDOWN - Q4 2025

3. Segment Analysis
- North America: $265.4M revenue (Solid enterprise demand in SaaS and cloud infrastructure)
- Europe, Middle East & Africa: $142.1M revenue (Strong public sector contract wins)
- Asia-Pacific: $75.0M revenue (Rapid expansion in semiconductor and fintech verticals)

4. Risk Management & Compliance
Compliance audit completed on November 14, 2025 by Deloitte & Touche LLP. Zero material weaknesses identified. Data privacy protocols upgraded to comply with global GDPR and SOC2 Type II standards.
Internal Risk Officer: Sarah Jenkins (s.jenkins@globalenterprise.corp)
Account Verification ID: ACC-99482-TX-2025`
      },
      {
        pageNumber: 3,
        width: 612,
        height: 792,
        rotation: 0,
        text: `GLOBAL ENTERPRISE HOLDINGS INC.
SIGNATURE & APPROVAL PAGE

IN WITNESS WHEREOF, the undersigned executive officers have executed this financial report and strategic plan as of December 31, 2025.

Chief Executive Officer:
Signature: __________________________
Name: Alexander Sterling
Date: December 31, 2025

Chief Financial Officer:
Signature: __________________________
Name: Marcus Vance
Date: December 31, 2025

Lead Independent Auditor:
Signature: __________________________
Name: Elena Rostova, CPA
Firm: Deloitte & Touche LLP`
      }
    ],
    annotations: [
      {
        id: "ann-1",
        pageIndex: 0,
        type: "highlight",
        x: 35,
        y: 18,
        width: 250,
        height: 18,
        color: "#fef08a",
        content: "record consolidated revenues of $482.5 million"
      },
      {
        id: "ann-2",
        pageIndex: 0,
        type: "text",
        x: 50,
        y: 68,
        width: 220,
        height: 40,
        content: "[Approved by Audit Committee - Q4]",
        color: "#1e3a8a",
        fontSize: 12,
        fontFamily: "sans-serif"
      }
    ]
  },
  {
    title: "Software Engineering Architecture Specification",
    fileName: "CloudNative_Microservices_Spec.pdf",
    fileSize: "1.8 MB",
    author: "Principal Architecture Board",
    subject: "Distributed Systems & Kubernetes Migration",
    isProtected: false,
    pages: [
      {
        pageNumber: 1,
        width: 612,
        height: 792,
        rotation: 0,
        text: `PROJECT NEXUS: CLOUD-NATIVE MICROSERVICES ARCHITECTURE
System Specification v3.2 - Confidential Technical Document

1. Architecture Overview
Project Nexus transitions our legacy monolithic backend into an event-driven, containerized microservices mesh deployed across multi-region Kubernetes clusters (EKS and GKE). Service mesh routing is handled by Istio with mutual TLS enabled by default.

2. Core Components
- API Gateway: Envoy Proxy with rate limiting (10,000 req/sec per tenant)
- Authentication: OAuth 2.0 / OIDC with JWT validation at edge
- Database Layer: Distributed PostgreSQL (CockroachDB) with Raft consensus replication
- Event Streaming: Apache Kafka cluster with 12 partitions per core topic

Lead System Architect: Dr. Aris Thorne (aris.thorne@nexus-systems.io)
Security Reviewer: Natasha Romanov (n.romanov@nexus-systems.io)`
      },
      {
        pageNumber: 2,
        width: 612,
        height: 792,
        rotation: 0,
        text: `PROJECT NEXUS: PERFORMANCE & SLA SPECIFICATION

3. Service Level Agreements (SLAs)
- Availability: 99.99% uptime guaranteed across global edge locations
- Latency: P99 latency under 45ms for all standard read queries
- Disaster Recovery: RPO < 5 seconds, RTO < 60 seconds via automated cross-region failover

4. Deployment Pipeline & CI/CD
All code changes must pass automated unit tests (minimum 90% coverage), SonarQube static security analysis, and container vulnerability scanning (Trivy) before deployment to staging environments.`
      }
    ],
    annotations: []
  }
];
