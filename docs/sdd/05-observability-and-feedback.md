# Observability and Feedback Loop

## Cosa osservare
- Task eseguiti dall'agente.
- File modificati.
- Test lanciati e risultati.
- Errori ricorrenti.
- Violazioni delle rules.
- Open point non risolti.
- Tempo da brief a output review-ready.

## Feedback loop minimo
1. L'agente produce output e self-check.
2. Il validatore determina anomalie documentali.
3. L'umano revisiona rischi e decisioni.
4. Le lessons learned aggiornano rules, prompt o SDD.
5. L'entropy cleanup rimuove drift e ridondanze.

## Metriche iniziali
- First-pass acceptance rate.
- Numero medio di revisioni per task.
- Violazioni per categoria.
- Drift doc/code rilevato.
- Decisioni critiche correttamente escalate.
