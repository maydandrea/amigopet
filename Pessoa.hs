{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE QuasiQuotes       #-}
module Pessoa where

import Foundation
import Yesod
import Database.Persist.Postgresql
import Data.Text

postPessoaR :: Handler ()
postPessoaR = do
    pers <- requireJsonBody :: Handler Pessoa
    pid <- runDB $ insert pers
    sendResponse (object [pack "resp" .= pack ("CREATED " ++ (show $ fromSqlKey pid))])


putPessoaAltR :: PessoaId -> Handler ()
putPessoaAltR pid = do
    pers <- requireJsonBody :: Handler Pessoa
    runDB $ get404 pid
    runDB $ update pid [PessoaNome =. (pessoaNome pers)
                      , PessoaCpf =. (pessoaCpf pers)
                      , PessoaEndereco =. (pessoaEndereco pers)
                      , PessoaContato =. (pessoaContato pers)]
    sendResponse (object [pack "resp" .= pack "UPDATED!"]) 


getPessoaListR :: Handler Html
getPessoaListR = do
    pers <- runDB $ selectList [] [Asc PessoaId]
    sendResponse (object [pack "resp" .= toJSON pers])


getPessoaDadosR :: PessoaId -> Handler ()
getPessoaDadosR pid = do
    pers <- runDB $ get404 pid
    sendResponse (object [pack "nome" .= pessoaNome pers,
                          pack  "cpf" .= pessoaCpf pers,
                          pack "endereco" .= pessoaEndereco pers,
                          pack "contato" .= pessoaContato pers])






