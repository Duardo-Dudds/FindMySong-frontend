# Especificações do Projeto  

Esta seção apresenta as especificações do sistema de busca de músicas por trechos de letras, partindo da perspectiva do usuário. Para isso, utilizamos:  

- **Personas** para detalhar os perfis ideais de usuários.  
- **Histórias de Usuários (User Stories)** para descrever necessidades e valores.  
- **Requisitos Funcionais e Não Funcionais** que delimitam o escopo da aplicação.  
- **Restrições do Projeto** que estabelecem limitações e condições para o desenvolvimento.  

---

## Personas  

**Persona 1 – Maria (usuária comum)**  
- Idade: 22 anos  
- Estudante universitária, gosta de ouvir música diariamente.  
- Objetivo: encontrar músicas lembrando apenas de um trecho da letra.  
- Dor: não consegue localizar a canção em aplicativos de streaming tradicionais.  

**Persona 2 – João (estudante de idiomas)**  
- Idade: 18 anos  
- Faz curso de inglês e usa músicas como recurso de aprendizado.  
- Objetivo: buscar letras para praticar vocabulário e compreensão auditiva.  
- Dor: dificuldade em localizar músicas específicas para estudo.  

**Persona 3 – Ana (professora/pesquisadora)**  
- Idade: 35 anos  
- Professora de inglês, utiliza músicas como recurso pedagógico em sala de aula.  
- Objetivo: selecionar rapidamente músicas que se encaixem em atividades didáticas.  
- Dor: perde tempo procurando canções adequadas para suas aulas.  

**Persona 4 – Carlos (músico/compositor)**  
- Idade: 28 anos  
- Músico independente, utiliza músicas como inspiração para composições.  
- Objetivo: pesquisar letras e identificar referências musicais.  
- Dor: dificuldade em encontrar obras com base em versos específicos.  

---

## Histórias de Usuários  

| EU COMO... (Persona)      | QUERO/PRECISO ... (Funcionalidade)   | PARA ... (Motivo/Valor)                        |  
|----------------------------|--------------------------------------|------------------------------------------------|  
| Usuário comum (Maria)      | Buscar músicas por trecho da letra   | Descobrir rapidamente o nome da canção         |  
| Estudante (João)           | Acessar a letra completa             | Usar como recurso pedagógico no estudo de idiomas |  
| Professora (Ana)           | Salvar músicas encontradas           | Reutilizar em aulas futuras                    |  
| Músico (Carlos)            | Comparar letras pesquisadas          | Inspirar novas composições                     |  
| Administrador do sistema   | Atualizar a base de letras e artistas| Manter o sistema preciso e atualizado          |  
| Usuário comum              | Avaliar a busca realizada            | Ajudar a melhorar a precisão dos resultados    |  

---

## Requisitos  

### Requisitos Funcionais (RF)  

| ID     | Descrição do Requisito                                         | Prioridade |  
|--------|----------------------------------------------------------------|------------|  
| RF-001 | Permitir a busca de músicas por trecho de letra                | ALTA       |  
| RF-002 | Exibir título, artista e opções de streaming                   | ALTA       |  
| RF-003 | Permitir feedback dos usuários sobre os resultados             | MÉDIA      |  
| RF-004 | Gerar relatórios de uso (músicas/artistas mais buscados)       | MÉDIA      |  
| RF-005 | Permitir que administradores atualizem layout e cadastros      | ALTA       |  
| RF-006 | Direcionar para plataformas de streaming oficiais              | ALTA       |  

### Requisitos Não Funcionais (RNF)  

| ID      | Descrição do Requisito                                         | Prioridade |  
|---------|----------------------------------------------------------------|------------|  
| RNF-001 | O sistema deve ser responsivo (desktop e mobile)              | ALTA       |  
| RNF-002 | O tempo de resposta deve ser inferior a 3 segundos por busca  | MÉDIA      |  
| RNF-003 | A interface deve ser intuitiva e acessível                    | ALTA       |  
| RNF-004 | O sistema deve respeitar direitos autorais (sem exibir mídia direta) | ALTA  |  
| RNF-005 | O sistema deve suportar pelo menos 500 buscas simultâneas     | MÉDIA      |  

---

## Restrições  

| ID   | Restrição                                                                 |  
|------|----------------------------------------------------------------------------|  
| 01   | O projeto deverá ser entregue até o final do semestre letivo.             |  
| 02   | Não será desenvolvido um módulo de backend robusto, apenas integração com APIs externas. |  
| 03   | O sistema deverá operar utilizando apenas APIs oficiais/licenciadas de música. |  
| 04   | O desenvolvimento deve ser feito em ambiente web, com suporte multiplataforma. |  
