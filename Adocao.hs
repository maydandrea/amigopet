{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Adocao where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postAdocaoR :: Handler ()
postAdocaoR = do
    addHeader "Access-Control-Allow-Origin" "*"
    adoc <- requireJsonBody :: Handler Adocao
    pid <- runDB $ insert adoc
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])

getAdocaoListR :: Handler Html
getAdocaoListR = do
    addHeader "Access-Control-Allow-Origin" "*"
    adoc <- runDB $ selectList [] [Desc AdocaoId]
    sendResponse (object [pack "resp" .= toJSON adoc])

getAdocaoListPetsR :: PessoaId -> Handler ()
getAdocaoListPetsR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    pets <- runDB $ (rawSql (pack $ "SELECT ?? FROM pet \
    \INNER JOIN adocao \
    \ON pet.id=adocao.idpet \
    \WHERE adocao.idpessoa=" ++ (show $ fromSqlKey pid)) []) :: Handler [(Entity Pet)]
    sendResponse (object [pack "resp" .= toJSON pets])
    
deleteAdocaoDelR :: AdocaoId -> Handler ()
deleteAdocaoDelR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    runDB $ get404 pid
    runDB $ delete pid
    sendResponse (object [pack "resp" .= pack "DELETED!"])
