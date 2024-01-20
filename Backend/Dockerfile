FROM maven:3.8.3-openjdk-17 AS DEPS

WORKDIR /opt/app

COPY pom.xml .
COPY ./pom.xml pom.xml

RUN mvn dependency:go-offline -B

FROM maven:3.8.3-openjdk-17 AS BUILDER

WORKDIR /opt/app

COPY --from=DEPS /root/.m2 /root/.m2
COPY --from=DEPS /opt/app/ /opt/app

COPY src /opt/app/src

RUN mvn package -B -DskipTests=true

FROM gcr.io/distroless/java17-debian11

WORKDIR /opt/app

COPY --from=BUILDER /opt/app/target/*.jar task-management-application.jar

ENTRYPOINT ["java", "-jar", "/opt/app/task-management-application.jar"]
