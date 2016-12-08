{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Interessado where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postInterR :: Handler ()
postInterR = do
    addHeader "Access-Control-Allow-Origin" "*"
    inter <- requireJsonBody :: Handler Interessado
    pid <- runDB $ insert inter
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])

getInterListPessoasR :: PetId -> Handler ()
getInterListPessoasR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    pers <- runDB $ (rawSql (pack $ "SELECT ?? FROM pessoa \
    \INNER JOIN interessado \
    \ON pessoa.id=interessado.idpessoa \
    \WHERE interessado.idpet=" ++ (show $ fromSqlKey pid)) []) :: Handler [(Entity Pessoa)]
    sendResponse (object [pack "resp" .= toJSON pers])

getInterListPetsR :: PessoaId -> Handler ()
getInterListPetsR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    pets <- runDB $ (rawSql (pack $ "SELECT ?? FROM pet \
    \INNER JOIN interessado \
    \ON pet.id=interessado.idpet \
    \WHERE interessado.idpessoa=" ++ (show $ fromSqlKey pid)) []) :: Handler [(Entity Pet)]
    sendResponse (object [pack "resp" .= toJSON pets])
    
deleteInterDelR :: InteressadoId -> Handler ()
deleteInterDelR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    runDB $ get404 pid
    runDB $ delete pid
    sendResponse (object [pack "resp" .= pack "DELETED!"])
