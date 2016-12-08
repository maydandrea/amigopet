{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Pessoa where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postPessoaR :: Handler ()
postPessoaR = do
    addHeader "Access-Control-Allow-Origin" "*"
    pers <- requireJsonBody :: Handler Pessoa
    pid <- runDB $ insert pers
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])


putPessoaAltR :: PessoaId -> Handler ()
putPessoaAltR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    addHeader "Access-Control-Allow-Methods" "PUT, OPTIONS"
    pers <- requireJsonBody :: Handler Pessoa
    runDB $ get404 pid
    runDB $ update pid [PessoaNome =. (pessoaNome pers)
                      , PessoaCpf =. (pessoaCpf pers)
                      , PessoaEndereco =. (pessoaEndereco pers)
                      , PessoaContato =. (pessoaContato pers)]
    sendResponse (object [pack "resp" .= pack "UPDATED!"]) 


getPessoaListR :: Handler Html
getPessoaListR = do
    addHeader "Access-Control-Allow-Origin" "*"
    pers <- runDB $ selectList [] [Asc PessoaId]
    sendResponse (object [pack "resp" .= toJSON pers])


getPessoaDadosR :: PessoaId -> Handler ()
getPessoaDadosR pid = do
    addHeader "Access-Control-Allow-Origin" "*"
    pers <- runDB $ get404 pid
    sendResponse (object [pack "nome" .= pessoaNome pers,
                          pack  "cpf" .= pessoaCpf pers,
                          pack "endereco" .= pessoaEndereco pers,
                          pack "contato" .= pessoaContato pers])






