{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Login where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postLoginR :: Handler ()
postLoginR = do
    addHeader "Access-Control-Allow-Origin" "*"
    log <- requireJsonBody :: Handler Login
    lid <- runDB $ insert log
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey lid))])

getLoginPessoaR :: Text -> Text -> Handler Html
getLoginPessoaR em se = do
    addHeader "Access-Control-Allow-Origin" "*"
    res <- runDB $ getBy404 (UniqueLogin em)
    sendResponse (object [  pack "pid" .= loginIdpessoa (entityVal res)])