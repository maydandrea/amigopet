{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Adocao where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postAdocaoR :: Handler ()
postAdocaoR = do
    adoc <- requireJsonBody :: Handler Adocao
    pid <- runDB $ insert adoc
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])

getAdocaoListR :: Handler Html
getAdocaoListR = do
    adoc <- runDB $ selectList [] [Desc AdocaoId]
    sendResponse (object [pack "resp" .= toJSON adoc])
    
deleteAdocaoDelR :: AdocaoId -> Handler ()
deleteAdocaoDelR pid = do
    runDB $ get404 pid
    runDB $ delete pid
    sendResponse (object [pack "resp" .= pack "DELETED!"])
