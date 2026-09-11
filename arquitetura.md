# Arquitetura do Smart Charger

## 1. Visão geral

O Smart Charger é organizado em um fluxo no qual os dados de uma recarga são registrados, processados após sua conclusão e posteriormente utilizados para alimentar o histórico, os relatórios, os indicadores e os gráficos do sistema.
---
             SMART CHARGER
                  │
                  ▼
        🚗 REGISTRO DA RECARGA
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
ESTAÇÃO/PRISMA        DADOS DO CARRO
        │                   │
        └─────────┬─────────┘
                  ▼
        RECARGA CONCLUÍDA
                  │
                  ▼
        CONSOLIDAÇÃO DOS DADOS
            "RES GERALZÃO"
                  │
         ┌────────┴────────┐
         ▼                 ▼
    HISTÓRICO          RELATÓRIOS
                            │
                            ▼
                        INDICADORES
                            │
                            ▼
                        GRÁFICOS
                            │
                            ▼
                        FILTROS
                            │
                            ▼
                    dadosFiltrados
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          Gráfico 1     Gráfico 2     Gráfico 3
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                    DADOS ATUALIZADOS

### Atualização dos indicadores

Os filtros atuam sobre os dados consolidados e provocam a atualização dos indicadores e visualizações.

KPI Recargas       147 → 52
KPI Tempo médio     38 → 34 min
KPI Carga média     42 → 47%
       │
       ├── Gráfico de recargas    → atualizado
       ├── Gráfico de carga       → atualizado
       ├── Gráfico de utilização  → atualizado
       └── Relatório              → atualizado

## 2. Estrutura operacional

A estrutura física e lógica do sistema é organizada em:

Torre
  │
  ▼
Piso
  │
  ▼
Estação / Prisma
  │
  ├── 🚗 Veículo em atendimento
  │
  └── ⏳ Fila de espera
             │
             ├── 1º
             ├── 2º
             ├── 3º
             └── ...

Essa estrutura permite que cada estação mantenha seu estado atual e, quando necessário, uma sequência ordenada de veículos aguardando atendimento.

---

## 3. Estrutura da regra de negócio

## Flowchart TB

    SC["⚡ SMART CHARGER"]
    🏢 Torre
    ⚡ Estação / Prisma
    🔋 Abertura
    ⏳ Fila de espera
    🚗 Veículos
    🙋 Manobrista da Torre
  
    🏢ALFREDO - PG 🙋ANTONIO
    │
    ├──⚡ESTAÇÃO #001
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗WEL2811 → ⚡PRISMA 00
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗ELI2408 → ⚡PRISMA 01
    │       ├── 2º 🚗ING1311 → ⚡PRISMA 02
    │       └── 3º 🚗MAY1611 → ⚡PRISMA 03
    │       ├── Nenhum veículo aguardando...
    │
    ├── ESTAÇÃO #002
    │   └── 🔋 ABERTURA
    │       └── BRE1002 → ⚡PRISMA 04 
    │       │
    │       └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │
    ├── ESTAÇÃO #003
    │   └── 🔋 ABERTURA
    │       └── 🚗DAN0905 → ⚡PRISMA 05
    │       │
    │       └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │
    ├── ESTAÇÃO #004
    │   └── 🔋 ABERTURA
    │       └── NAT8204 → ⚡PRISMA 06
    │       │
    │       └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    _____________________________________________

    🏢TJ - 1º SS 🙋BASÍLIO
    │
    ├──⚡ESTAÇÃO #005
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗DAC1307 → ⚡PRISMA 00
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗DOM2609 → ⚡PRISMA 01   
    │       ├── Nenhum veículo aguardando...
    │        
    ├──⚡ESTAÇÃO #006
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗ADA2308 → ⚡PRISMA 02
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗FAB3010 → ⚡PRISMA 03
    │       ├── Nenhum veículo aguardando...
    │        
    _____________________________________________

    🏢TJ - AZUL 🙋CARLOS
    │
    ├──⚡ESTAÇÃO #007
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗BRU2108 → ⚡PRISMA 00
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │        
    ├──⚡ESTAÇÃO #008
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗TAT1110 → ⚡PRISMA 01
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │             
    ├──⚡ESTAÇÃO #009
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗LAN2802 → ⚡PRISMA 02
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │ 
    ├──⚡ESTAÇÃO #010
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗ERI2806 → ⚡PRISMA 03
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │ 
    ├──⚡ESTAÇÃO #011
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗ITA0910 → ⚡PRISMA 04
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │ 
    ├──⚡ESTAÇÃO #012
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗CLE2908 → ⚡PRISMA 05
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │ 
    ├──⚡ESTAÇÃO #013
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗ALV0701 → ⚡PRISMA 06
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │ 
    ├──⚡ESTAÇÃO #014
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗KET3112 → ⚡PRISMA 07
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    _____________________________________________

    🏢TJ - 1ª ANDAR 🙋DIEGO
    │
    ├──⚡ESTAÇÃO #015
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗LAR2007 → ⚡PRISMA 00
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗BET0905 → ⚡PRISMA 01
    │       ├── 2º 🚗SAB1512 → ⚡PRISMA 02
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #016
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗LOR0909 → ⚡PRISMA 03
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗TAL1805 → ⚡PRISMA 04
    │       ├── 2º 🚗VER0801 → ⚡PRISMA 05
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #017
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗RAY2105  → ⚡PRISMA 06
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗JOY3101 → ⚡PRISMA 06
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #018
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗NAT2905  → ⚡PRISMA 07
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    _____________________________________________

    🏢OLAVO - PG 🙋FABIANO
    │
    ├──⚡ESTAÇÃO #019
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗MAR0703 → ⚡PRISMA 00
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗MAR0306 → ⚡PRISMA 01
    │       ├── 2º 🚗VIC1202 → ⚡PRISMA 02
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #020
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗WEB0111 → ⚡PRISMA 03
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #021
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗ABM1601  → ⚡PRISMA 04
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #022
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗AMA2010  → ⚡PRISMA 05
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── Nenhum veículo aguardando...
    │
    ├──⚡ESTAÇÃO #032
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗EMY1209  → ⚡PRISMA 06
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗KIE1205 → ⚡PRISMA 07
    │       ├── 2º 🚗JJJ2562 → ⚡PRISMA 08
    │       ├── 3º 🚗CLE3612 → ⚡PRISMA 09
    │       ├── 4º 🚗POP1122 → ⚡PRISMA 10
    │       ├── Nenhum veículo aguardando... 
    │
    ├──⚡ESTAÇÃO #024
    │   ├── 🔋 ABERTURA
    │   │   └── 🚗SAR2124  → ⚡PRISMA 11
    │   │
    │   └── ⏳ FILA DE ESPERA
    │       ├── 1º 🚗JOH2125 → ⚡PRISMA 12
    │       ├── 2º 🚗RAF5505 → ⚡PRISMA 13
    │       ├── 3º 🚗SOF0555 → ⚡PRISMA 14
    │       ├── 4º 🚗WHE1504 → ⚡PRISMA 15
    │       ├── Nenhum veículo aguardando...
    │

> **Observação:** as posições da fila são dinâmicas. Quando uma recarga é concluída, o próximo veículo pode assumir a estação e a fila é reorganizada.

---

4. Regra de negócio da fila

## mermaid
flowchart TD

    IN["🚗 Veículo chega"] --> DISP{"Estação disponível?"}

    DISP -->|Sim| AB["🔋 Iniciar recarga"]
    DISP -->|Não| FILA["⏳ Entrar na fila"]

    FILA --> POS["Definir posição"]
    POS --> N1["1º"]
    N1 --> N2["2º"]
    N2 --> N3["3º"]
    N3 --> NN["..."]

    AB --> FIM{"Recarga concluída?"}

    FIM -->|Não| AB
    FIM -->|Sim| PROX{"Existe veículo na fila?"}

    PROX -->|Sim| RET["🚗 Próximo veículo"]
    PROX -->|Não| LIVRE["🟢 Estação livre"]

    RET --> AB

### Comportamento

* Se houver estação disponível, o veículo inicia a recarga.
* Se todas as estações estiverem ocupadas, o veículo entra na fila.
* A posição é definida de acordo com a ordem de chegada.
* Ao concluir uma recarga, o sistema verifica a existência de veículos aguardando.
* Havendo fila, o próximo veículo é direcionado para a estação.
* Não havendo fila, a estação permanece livre.

---

## 5. Exemplo de resultado filtrado

Os dados consolidados também alimentam os componentes analíticos do sistema.

---
                    DADOS CONSOLIDADOS
                           │
                           ▼
                        FILTROS
                           │
                           ▼
                     dadosFiltrados
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
     INDICADORES        GRÁFICOS         RELATÓRIO
          │                │
          ▼                ▼
       KPIs         Visualizações


Um filtro pode alterar simultaneamente os valores apresentados nos KPIs, nos gráficos e no relatório, mantendo todos os componentes sincronizados com o mesmo conjunto de `dadosFiltrados`.

---

## 6. Resumo da arquitetura
---
                    ⚡ SMART CHARGER
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       REGISTRO DE RECARGA       ESTRUTURA OPERACIONAL
              │                         │
              ▼                         ▼
       RECARGA CONCLUÍDA          TORRE → PISO
              │                         │
              ▼                         ▼
      CONSOLIDAÇÃO DOS DADOS     ESTAÇÃO / PRISMA
              │                         │
       ┌──────┴──────┐            ┌────┴────┐
       ▼             ▼            ▼         ▼
   HISTÓRICO      RELATÓRIOS   ABERTURA    FILA
                     │                     │
                     ▼                     ▼
                INDICADORES            1º → 2º → 3º
                     │
                     ▼
                  GRÁFICOS
                     │
                     ▼
                   FILTROS
                     │
                     ▼
               dadosFiltrados

Essa arquitetura representa os principais fluxos do Smart Charger: **registro das recargas, gerenciamento das estações e filas, consolidação dos resultados e geração dos dados analíticos**.
