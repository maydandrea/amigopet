{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Person where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postPersonR :: Handler ()
postPersonR = do
    pers <- requireJsonBody :: Handler Person
    pid <- runDB $ insert pers
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])

getPeopleR :: Handler Html
getPeopleR = do
    pers <- runDB $ selectList [] [Asc PersonFirstname]
    sendResponse (object [pack "resp" .= toJSON pers])

getSecretaryR :: Handler Html
getSecretaryR = do
    boss <- runDB $ (rawSql "SELECT ??, ?? \
            \FROM depto INNER JOIN person \
            \ON depto.secretary=person.id" [])::Handler [(Entity Depto, Entity Person)]
    sendResponse (object [pack "resp" .= toJSON boss])                

deleteDelPersonR :: PersonId -> Handler ()
deleteDelPersonR pid = do
    runDB $ get404 pid
    runDB $ delete pid
    sendResponse (object [pack "resp" .= pack "DELETED!"])  

-- CASO SEJA UM CAMPO, USAMOS PATCH
-- patchUpdateR
putUpdateR :: PersonId -> Handler ()
putUpdateR pid = do
    pers <- requireJsonBody :: Handler Person
    runDB $ get404 pid
    runDB $ update pid [PersonFirstname =. (personFirstname pers)
                      , PersonLastname  =. (personLastname pers)
                      , PersonManager   =. (personManager pers)
                      , PersonWorksin   =. (personWorksin pers)]
    sendResponse (object [pack "resp" .= pack "UPDATED!"])  
    
    
    