# Security & Compliance Controls

## Controlli minimi
- No secrets in repository.
- No credenziali personali.
- Utenze tecniche test dedicate.
- Least privilege.
- Review umana prima di accessi esterni.
- Tracciabilità task → SDD → ADR → PR.
- Controllo dati personali prima del trattamento.

## Mappatura regolatoria iniziale
| Area | Applicazione al progetto |
|---|---|
| GDPR | minimizzazione, privacy-by-design, controllo dati personali nei prompt |
| DORA | gestione rischio ICT, terze parti, resilienza operativa, logging |
| NIS2 | governance cybersecurity, misure tecniche e organizzative |
| EU AI Act | governance sistemi AI, supervisione umana, gestione rischio |
| IVASS | presidio operativo, outsourcing/ICT, tracciabilità e controlli |

## Gate compliance
Prima di ogni integrazione esterna, compilare:
- dati trattati;
- sistema coinvolto;
- finalità;
- owner;
- livello di accesso;
- rischi;
- mitigazioni;
- decisione approvativa.
