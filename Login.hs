{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Login where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postLoginR :: Handler ()
postLoginR = do
    log <- requireJsonBody :: Handler Login
    lid <- runDB $ insert log
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey lid))])

{-getLoginR :: LoginId -> Handler ()
getLoginR lid = do
    log <- runDB $ get404 lid
    sendResponse (object [pack "email" .= loginEmail log,
                          pack  "senha" .= loginSenha log])-}