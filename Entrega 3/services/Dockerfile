ARG PROJECT_DIR="/access_service" 
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR ${PROJECT_DIR}
COPY ${PROJECT_DIR} .

RUN dotnet restore
CMD ["dotnet", "run"]
EXPOSE 8000