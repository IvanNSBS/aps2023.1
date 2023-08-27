ARG PROJECT_DIR="/access_service" 
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR ${PROJECT_DIR}
COPY ${PROJECT_DIR} .

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"
RUN dotnet restore
# ENTRYPOINT ["tail", "-f", "/dev/null"]
# CMD ["dotnet", "ef", "database", "update"]