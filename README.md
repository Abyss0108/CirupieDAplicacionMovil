PProyecto de Gestión de Citas - Aplicación Móvil
1. Descripción del Proyecto
Este proyecto consiste en una aplicación móvil desarrollada con React Native para la gestión de citas en una clínica. Los clientes podrán registrarse y agendar sus citas, con la opción de realizar un pago anticipado del 50%. El personal administrativo tendrá acceso para gestionar y revisar las agendas.

Objetivo: Facilitar la interacción entre clientes y personal de la clínica, mejorando la eficiencia en la gestión de citas y procesos de pago.

Metodología de Trabajo: Se utiliza Kanban para mantener un flujo continuo de trabajo y adaptarse a las necesidades cambiantes del proyecto. Las tareas se gestionan en Trello, organizadas en listas que reflejan su estado actual.

2. Herramienta de Control de Versiones y Flujo de Trabajo
El proyecto utiliza Git para el control de versiones, con GitHub como plataforma de colaboración. El flujo de trabajo sigue el modelo GitFlow, que facilita la integración de nuevas funcionalidades y la corrección de errores de manera organizada.

2.1 Flujo de trabajo de ramas:
main: Rama de producción estable.
develop: Rama de desarrollo donde se integran las nuevas funcionalidades antes de pasar a producción.
feature/: Ramas dedicadas al desarrollo de nuevas funcionalidades (por ejemplo, feature/agendar-cita).
hotfix/: Ramas dedicadas a la corrección urgente de errores críticos en producción.
Jerarquía de Ramas
    main --> develop;
    develop --> feature/agendar-cita;
    develop --> feature/diseñar-pantallas;
    develop --> feature/desarrollar-apis;
    develop --> hotfix/corrección-bug1;
    develop --> hotfix/corrección-bug2;
3. Estrategia de Versionamiento y Gestión de Ramas
main: Código de producción estable.
develop: Nueva funcionalidad integrada para pruebas.
feature/: Ramas creadas desde develop para trabajar en funcionalidades específicas. Una vez completadas, se hacen pull requests para su revisión y aprobación.
hotfix/: Ramas creadas desde main para corregir errores críticos. Estas ramas se fusionan rápidamente en main y develop.
4. Estrategia de Despliegue
4.1 Estrategia Seleccionada: Canary Deployment
El despliegue de nuevas versiones se realiza de forma gradual para reducir el impacto de errores en producción. Se monitoriza el rendimiento y se implementan cambios de manera controlada.

4.2 Entornos de Despliegue:
Desarrollo: Nuevas funcionalidades se desarrollan en ramas feature/.
Staging: Validación e integración de las funcionalidades en develop.
Producción: Contiene el código estable proveniente de main.
4.3 Integración Continua: GitHub Actions
El proyecto utiliza GitHub Actions para automatizar las pruebas y el despliegue de la aplicación. Cada commit en develop o main dispara procesos de integración continua (CI) y despliegue (CD), validando el código antes de llevarlo a producción.

5. Instrucciones para Clonar, Instalar Dependencias y Ejecutar el Proyecto
