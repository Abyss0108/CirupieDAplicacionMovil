# Proyecto de Gestión de Citas - Aplicación Móvil

##  Descripción del Proyecto
Este proyecto consiste en una aplicación móvil desarrollada con React Native para la gestión de citas en una clínica. Los clientes podrán registrarse y agendar sus citas, con la opción de realizar un pago anticipado del 50%. El personal administrativo tendrá acceso para gestionar y revisar las agendas.

- Objetivo: Facilitar la interacción entre clientes y personal de la clínica, mejorando la eficiencia en la gestión de citas y procesos de pago.

- Metodología de Trabajo: Se utiliza Kanban para mantener un flujo continuo de trabajo y adaptarse a las necesidades cambiantes del proyecto. Las tareas se gestionan en Trello, organizadas en listas que reflejan su estado actual.

##  Gestion de Issues 
### Sprint 1 (23 sept - 29 sept)
####Issue: Definir el objetivo de la aplicación.
Responsable: Maria Lina Maximo Hernandez
Fecha límite: 24 sept
Descripción: Definir claramente el objetivo de la aplicación para alinear el desarrollo con los requerimientos de la clínica.
#### Issue: Identificar el público objetivo.
Responsable: Maria Lina Maximo Hernandez
Fecha límite: 26 sept
Descripción: Definir el público objetivo para personalizar la experiencia de usuario.
#### Issue: Recopilar requisitos funcionales y no funcionales.

Responsable: Victor Fernando Rivera Hernandez
Fecha límite: 29 sept
Descripción: Documentar los requisitos necesarios para la aplicación, tanto en funcionalidad como en desempeño.
### Sprint 2 (29 sept - 5 oct)
#### Issue: Crear diseños de pantallas.

Responsable: Maria Lina Maximo Hernandez
Fecha límite: 1 oct
Descripción: Diseñar las pantallas de la aplicación siguiendo los lineamientos establecidos por el cliente.
#### Issue: Definir la arquitectura de navegación.

Responsable: Victor Fernando Rivera Hernandez
Fecha límite: 4 oct
Descripción: Desarrollar el esquema de navegación para asegurar una experiencia fluida.
#### Issue: Recrear la experiencia del usuario.

Responsable: Victor Fernando Rivera Hernandez-Maria Lina Maximo Hernandez
Fecha límite: 5 oct
Descripción: Implementar mejoras en la experiencia de usuario basada en pruebas internas.
### Sprint 3 (6 oct - 13 oct)
#### Issue: Configurar servidores y bases de datos.

Responsable:  Victor Fernando Rivera Hernandez
Fecha límite: 9 oct
Descripción: Configuración de la infraestructura del servidor y base de datos para soportar la aplicación.
#### Issue: Desarrollar APIs y servicios.

Responsable: Maria Lina Maximo Hernandez
Fecha límite: 13 oct
Descripción: Desarrollo de los servicios y APIs necesarios para la gestión de citas.
### Sprint 4 (14 oct - 31 oct)
#### Issue: Implementar seguridad.

Responsable: Victor Fernando Rivera Hernandez
Fecha límite: 15 oct
Descripción: Asegurar que la aplicación cumple con los estándares de seguridad requeridos.
#### Issue: Desarrollar interfaces de usuario.

Responsable: Maria Lina Maximo Hernandez
Fecha límite: 22 oct
Descripción: Desarrollo de la interfaz de usuario siguiendo los diseños aprobados.
#### Issue: Integrar APIs y lógica de negocio.

Responsable: Victor Fernando Rivera Hernandez
Fecha límite: 25 oct
Descripción: Integrar las APIs con la lógica del negocio para garantizar una funcionalidad completa.
#### Issue: Gestionar almacenamiento y sincronización.

Responsable: Victor Fernando Rivera Hernandez-Maria Lina Maximo Hernandez
Fecha límite: 31 oct
Descripción: Configurar la sincronización entre la aplicación y la base de datos para el almacenamiento de información.
### Sprint 5 (1 nov - 6 nov)
#### Issue: Realizar pruebas de usabilidad con usuarios finales.

Responsable: Maria Lina Maximo Hernandez
Fecha límite: 4 nov
Descripción: Probar la aplicación con usuarios reales para obtener retroalimentación sobre la experiencia de usuario.
#### Issue: Realizar pruebas de rendimiento y seguridad.

Responsable: Victor Fernando Rivera Hernandez-Maria Lina Maximo Hernandez
Fecha límite: 6 nov
Descripción: Asegurar que la aplicación tenga un rendimiento óptimo y que las medidas de seguridad sean adecuadas.

##  Herramienta de Control de Versiones y Flujo de Trabajo

El proyecto utiliza Git para el control de versiones, con GitHub como plataforma de colaboración. El flujo de trabajo sigue el modelo GitFlow, que facilita la integración de nuevas funcionalidades y la corrección de errores de manera organizada.

### Flujo de trabajo de ramas:
main: Rama de producción estable.
develop: Rama de desarrollo donde se integran las nuevas funcionalidades antes de pasar a producción.
feature/: Ramas dedicadas al desarrollo de nuevas funcionalidades (por ejemplo, feature/agendar-cita).
hotfix/: Ramas dedicadas a la corrección urgente de errores críticos en producción.

###### Jerarquía de Ramas
    main --> develop;
    	develop --> feature/agendar-cita;
    	develop --> feature/diseñar-pantallas;
    	develop --> feature/desarrollar-apis;
    	develop --> hotfix/corrección-bug1;
    	develop --> hotfix/corrección-bug2;

## Estrategia de Versionamiento y Gestión de Ramas

- main: Código de producción estable.
- develop: Nueva funcionalidad integrada para pruebas.
- feature/: Ramas creadas desde develop para trabajar en funcionalidades específicas. Una vez completadas, se hacen pull requests para su revisión y aprobación.
- hotfix/: Ramas creadas desde main para corregir errores críticos. Estas ramas se fusionan rápidamente en main y develop.

## Estrategia de Despliegue

### Estrategia Seleccionada: Canary Deployment
El despliegue de nuevas versiones se realiza de forma gradual para reducir el impacto de errores en producción. Se monitoriza el rendimiento y se implementan cambios de manera controlada.

###Entornos de Despliegue:
- Desarrollo: Nuevas funcionalidades se desarrollan en ramas feature/.
- Staging: Validación e integración de las funcionalidades en develop.
- Producción: Contiene el código estable proveniente de main.
### Integración Continua: GitHub Actions
El proyecto utiliza GitHub Actions para automatizar las pruebas y el despliegue de la aplicación. Cada commit en develop o main dispara procesos de integración continua (CI) y despliegue (CD), validando el código antes de llevarlo a producción.

## Instrucciones para Clonar, Instalar Dependencias y Ejecutar el Proyecto
#### Clonar el Repositorio

	git clone https://github.com/Abyss0108/CirupieDAplicacionMovil.git
	cd CirupieDAplicacionMovil
####  Instalar Dependencias
	npm install
### Ejecutar el Proyecto
	npm run start

