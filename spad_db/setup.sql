create table flows( flow_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ip_id INT, port INT, name TEXT, qos TEXT, protocol TEXT, service_id TEXT );
create table ip_address( ip_id INT NOT NULL, ip_count INT NOT NULL AUTO_INCREMENT, ip TEXT, PRIMARY KEY (ip_count, ip_id)) ENGINE=MyISAM;
create table services (service_id INT NOT NULL PRIMARY KEY, s_name TEXT, validtill TEXT, domain_id INT);
create table domains (domain_id INT NOT NULL PRIMARY KEY, domain TEXT );

insert into flows(ip_id, port, name, protocol, service_id) values (1, 5061, 'example.com', 'tls', 1);
insert into flows(ip_id, port, qos, protocol, service_id) values (2, 5004, 'EF', 'udp', 1);
insert into flows(ip_id, port, name, protocol, service_id) values (3, 5061, 'example.de', 'tls', 2);
insert into flows(ip_id, port, qos, protocol, service_id) values (4, 5004, 'EF', 'udp', 2);
insert into flows(ip_id, port, qos, protocol, service_id) values (5, 5006, 'AF41', 'udp', 3);

insert into ip_address( ip_id, ip) values (1,'203.0.113.2');
insert into ip_address( ip_id, ip) values (1,'2001:db8::1');
insert into ip_address( ip_id, ip) values (2,'192.0.2.1');
insert into ip_address( ip_id, ip) values (2,'2001:db8::2');
insert into ip_address( ip_id, ip) values (3,'203.0.113.2');
insert into ip_address( ip_id, ip) values (3,'2001:db8::1');
insert into ip_address( ip_id, ip) values (4,'192.0.2.1');
insert into ip_address( ip_id, ip) values (4,'2001:db8::2');
insert into ip_address( ip_id, ip) values (5,'203.0.113.2');
insert into ip_address( ip_id, ip) values (5,'2001:db8::1');



insert into services (service_id, s_name, validtill, domain_id) values (1, 'voice-example-a', '1504272294', 1);
insert into services (service_id, s_name, validtill, domain_id) values (2, 'voice-example', '1504272294', 2);
insert into services (service_id, s_name, validtill, domain_id) values (3, 'video-example-b', '1504272294', 1);

insert into domains (domain_id, domain) values (1, 'example.com');
insert into domains (domain_id, domain) values (2, 'example.de');

DROP PROCEDURE IF EXISTS JSONbuild;
DELIMITER //
CREATE PROCEDURE JSONbuild
(IN INdomain varchar(255))
BEGIN

SELECT
  JSON_OBJECT(
    'domain', dom.domain,
    'services', (select CAST(CONCAT('[',
       GROUP_CONCAT(
         JSON_OBJECT(
           'name', services.s_name,
           'validtill', services.validtill,
           'flows', (select CAST(CONCAT('[', GROUP_CONCAT(
              JSON_OBJECT(
                 'ips', (select CONCAT('[',
                    GROUP_CONCAT(ip_address.ip),
                  ']') FROM ip_address WHERE ip_address.ip_id = flows.ip_id),  
                 'port', flows.port,
                 'name', flows.name,
                 'protocol', flows.protocol
               )
            ),
          ']')
          AS JSON) FROM flows WHERE flows.service_id = services.service_id)                              
         )
       ),
      ']')
      AS JSON) FROM services WHERE services.domain_id= dom.domain_id)
  ) AS json_obj FROM domains dom WHERE dom.domain= 'example.com';

END //
DELIMITER ;
