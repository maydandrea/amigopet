{-# LANGUAGE OverloadedStrings, TypeFamilies, QuasiQuotes,
             TemplateHaskell, GADTs, FlexibleContexts,
             MultiParamTypeClasses, DeriveDataTypeable, EmptyDataDecls,
             GeneralizedNewtypeDeriving, ViewPatterns, FlexibleInstances #-}
module Foundation where

import Yesod
import Data.Text
import Database.Persist.Postgresql
    ( ConnectionPool, SqlBackend, runSqlPool)

data App = App {connPool :: ConnectionPool }

share [mkPersist sqlSettings, mkMigrate "migrateAll"] [persistLowerCase|

Pet json
    nome Text
    raca Text
    cor Text
    idade Text
    especie Text
    idpessoa PessoaId
    deriving Show
    
Pessoa json
    nome Text
    cpf Text
    endereco Text
    contato Text
    deriving Show
 
Adocao json
    idpessoa PessoaId 
    idpet PetId
    UniqueAdocao idpessoa idpet
    deriving Show

Interessado json
    idpessoa PessoaId
    idpet PetId
    UniqueInteressado idpessoa idpet
    deriving Show
    
Login json  
    email Text
    senha Text
    cdPessoa PessoaId
    UniqueLogin email
    deriving Show
|]

mkYesodData "App" $(parseRoutesFile "routes")

instance Yesod App

instance YesodPersist App where
   type YesodPersistBackend App = SqlBackend
   runDB f = do
       master <- getYesod
       let pool = connPool master
       runSqlPool f pool

