
SETLOCAL
TITLE Elasticsearch 1.4.2

SET JAVA_HOME=c:\Program Files (x86)\Java\jre7

CALL "%~dp0elasticsearch.in.bat"

"%JAVA_HOME%\bin\java" %JAVA_OPTS% %ES_JAVA_OPTS% %ES_PARAMS% %* -cp "%ES_CLASSPATH%" "org.elasticsearch.bootstrap.Elasticsearch"

ENDLOCAL