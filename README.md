# ASP-Basic
ASP 기본 회원가입 및 게시판 소스입니다.

- 회원가입, 로그인, 게시판(Q&A)
- javascript 정규식을 통한 기본 유효성 검증과 서버 사이드 파라미터 검증
- ID 중복확인(Ajax)
- SQL-INJECTION 방지 & XSS 방지 및 데이터 포맷 처리를 위한 함수 구현
- SessionID를 통한 중복로그인 방지 & REFERER CHECK
- 게시판 Depth 및 페이징 처리
- 게시판 작성 : WYSIWYG Editor(summernote, Naver SmartEditor) 사용
- DB : MSSQL localDB SQL-Server 인증을 통해 구성
<br/>
<br/>

# TABLE    
- [t_usr] :               회원 테이블           <br/>
- [test] :                게시판 테이블         <br/>
- [check_login_double] :  중복로그인 체크 테이블 <br/>    
cf. 각 저장 로직(saveP)에 테이블 스크립트가 있습니다.<br/>
# SSL 
- 로컬 IIS의 IIS Express Development Certificate 사용하여 바인딩 <br/>
