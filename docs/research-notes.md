# FAYE Research Notes

Date: 2026-06-28

## Competitive References

These apps are references for product strategy, not UI to copy.

- Recycle Coach: useful for local/municipal recycling guidance, collection schedules, and searchable sorting education. Source: https://www.recyclecoach.com/
- Bower: useful for the scan -> classify -> reward loop, barcode/photo recognition, CO2 tracking, nearby recycling points, and incentives. Source: https://getbower.com/
- Litterati: useful for turning waste/litter capture into structured data for cities, NGOs, researchers, and brands. Source: https://www.litterati.org/
- Olio: useful for community habit formation and waste reduction through local sharing. It is more about food/items than household recycling classification. Source: https://olioapp.com/en/

## Peru Context

MINAM frames the problem as a habit and infrastructure gap, not only an information gap.

- Peru's recycling rate is reported at 2.1% of generated waste, while potential recovery reaches 78%.
- MINAM attributes the gap to limited segregation culture plus limited infrastructure and differentiated collection by local governments.
- 2023 daily generation reached 23,852 tons; a 2025 MINAM note reports 2024 generation at 24,643 tons per day and 2.8% valorized waste.
- The legal frame prioritizes prevention/minimization first, then recovery and valorization such as reuse, recycling, composting, and energy/material recovery.
- DL 1278 also establishes gradual source segregation and selective collection for municipal waste.

Sources:

- MINAM Recicla ya: https://www.gob.pe/institucion/minam/campa%C3%B1as/106333-recicla-ya-educar-para-reciclar
- MINAM 2024 waste valuation note: https://www.gob.pe/institucion/minam/noticias/1205034-municipios-reportan-incremento-en-valorizacion-de-residuos-solidos-durante-2024
- DL 1278: https://www.minam.gob.pe/wp-content/uploads/2017/04/Decreto-Legislativo-N%C2%B0-1278.pdf

## Product Implications

FAYE should focus on removing friction at the decision moment:

1. Identify the residue from image or safe fallback.
2. Explain the correct category with confidence and uncertainty.
3. Adapt guidance to the user's local context when district data is available.
4. Record the action as habit progress.
5. Show simple impact without promising false precision.
6. Later, turn household actions into useful aggregate insight for communities or municipalities.

## MVP Direction

For the June 30 demo, the best product story is:

FAYE helps the user decide what to do with a residue, act correctly, and build a repeatable habit. Eve remains the internal AI layer that powers the intelligence behind FAYE.
