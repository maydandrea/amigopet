{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Pet where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postPetR :: Handler ()
postPetR = do
    pets <- requireJsonBody :: Handler Pet
    pid <- runDB $ insert pets
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])


putPetAltR :: PetId -> Handler ()
putPetAltR pid = do
    pets <- requireJsonBody :: Handler Pet
    runDB $ get404 pid
    runDB $ update pid [PetNome =. (petNome pets)
                      , PetRaca =. (petRaca pets)
                      , PetCor =. (petCor pets)
                      , PetIdade =. (petIdade pets)
                      , PetEspecie =. (petEspecie pets)]
    sendResponse (object [pack "resp" .= pack "UPDATED!"]) 


getPetListR :: Handler Html
getPetListR = do
    pets <- runDB $ selectList [] [Asc PetId]
    sendResponse (object [pack "resp" .= toJSON pets])


getPetDadosR :: PetId -> Handler ()
getPetDadosR pid = do
    pets <- runDB $ get404 pid
    sendResponse (object [pack "nome" .= petNome pets,
                          pack  "raca" .= petRaca pets,
                          pack "cor" .= petCor pets,
                          pack "idade" .= petIdade pets,
                          pack "especie" .= petEspecie pets])


getPetsPessoaR :: PessoaId -> Handler Html
getPetsPessoaR pid = do
    pets <- runDB $ selectList [PetIdpessoa ==. pid] [Asc PetId]
    sendResponse (object [pack "resp" .= toJSON pets])
    



{-    
     boss <- runDB $ (rawSql "SELECT ??, ?? \
            \FROM pet \
            \WHERE idpessoa=pessoa.id" [])::Handler [(Entity Depto, Entity Person)]
    sendResponse (object [pack "resp" .= toJSON boss])-}


deletePetDelR :: PetId -> Handler ()
deletePetDelR pid = do
    runDB $ get404 pid
    runDB $ delete pid
    sendResponse (object [pack "resp" .= pack "DELETED!"])