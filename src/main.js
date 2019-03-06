'use strict';

ImapClient = (ImapClient) ? ImapClient : require("emailjs-imap-client");
SmtpClient = (SmtpClient) ? SmtpClient : require("emailjs-smtp-client");

require("angular");

var app = angular.module('emailjsApp', []);
var imapClient;

var limitPull = 20;

app.controller('mainCtrl', function ($scope, $timeout) {
  document.getElementById('app').style.display = 'block';

  $scope.login = {};
  $scope.compose = {};

  $scope.mailboxes = {};
  $scope.loading = false;

  $scope.selectedMailbox;
  $scope.showCompose = false;

  $scope.connect = function () {
    $scope.loading = true;

    imapClient = new ImapClient($scope.login.imap.host, $scope.login.imap.port, {
      auth: {
        user: $scope.login.email,
        pass: $scope.login.password
      }
    });

    imapClient.connect()
      .then(function () {
        $scope.loading = false;
        $scope.login.connected = true;

        imapClient.listMailboxes().then(function (mailboxes) {
          console.log(mailboxes);
          $scope.mailboxes = mailboxes.children;

          $scope.selectMailbox($scope.mailboxes[0]);
        });
      })
      .catch(err => {
        alert('Sorry, we got some error: \n' + err);
        console.error(err);
      });

    imapClient.onerror = function (error) {
      alert("We got some error! Please check console log.");
    }
  };

  $scope.selectMailbox = function (selectedMailbox) {
    $scope.selectedMailbox = selectedMailbox;

    imapClient.selectMailbox(selectedMailbox.path).then(function (mailbox) {
      console.log(mailbox);
      $scope.selectedMailbox.exists = mailbox.exists;
      $scope.selectedMailbox.messages = $scope.selectedMailbox.messages || [];

      if (!$scope.selectedMailbox.messages.length) {
        $scope.pullMessages();
      }

      $timeout();
    });
  };

  $scope.pullMessages = function () {
    var seqFrom = $scope.selectedMailbox.messages.length + 1;
    var seqTo = seqFrom + limitPull - 1;

    seqTo = (seqTo <= $scope.selectedMailbox.exists) ? seqTo : $scope.selectedMailbox.exists;

    if (seqFrom > seqTo) {
      return;
    }

    imapClient.listMessages($scope.selectedMailbox.path, seqFrom + ":" + seqTo, ['uid', 'envelope']).then(function (messages) {
      messages.forEach(function (message) {
        console.log(message);
        $scope.selectedMailbox.messages.push(message);

        $timeout();
      });
    });
  };

  $scope.showComposeForm = function () {
    $scope.compose = {};
    $scope.showCompose = ($scope.showCompose) ? false : true;
  };

  $scope.sendMessage = function () {
    var clientSmtp = new SmtpClient($scope.login.smtp.host, $scope.login.smtp.port, {
      auth: {
        user: $scope.login.email,
        pass: $scope.login.password
      }
    });

    var alreadySending = false;
    clientSmtp.onidle = function () {
      console.log("Connection has been established");

      if (alreadySending) {
        return;
      }

      alreadySending = true;

      clientSmtp.useEnvelope({
        from: $scope.login.email,
        to: $scope.compose.to
      });
    };

    clientSmtp.ondone = function () {
      clientSmtp.quit();
      $scope.showCompose = false;
      $timeout();
    };

    clientSmtp.onready = function () {
      clientSmtp.send("Subject: " + $scope.compose.subject + "\r\n");
      clientSmtp.send("\r\n");
      clientSmtp.send($scope.compose.content);
      clientSmtp.end();
    }

    clientSmtp.onerror = function (err) {
      alert("Got errors - take a look at console log.")
    };

    clientSmtp.onclose = function (err) {
      console.log("closed");
    };

    clientSmtp.oncert = function () {
    };

    clientSmtp.connect();
  }
});
