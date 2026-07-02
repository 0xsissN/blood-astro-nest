import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignsService } from './campaigns.service';
import { Campaign } from './entities/campaign.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let repository: Repository<Campaign>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    repository = module.get<Repository<Campaign>>(getRepositoryToken(Campaign));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a campaign successfully', async () => {
      const createDto = {
        nombre: 'Campaña Test',
        lugar: 'Hospital Central',
        fechaInicio: '2026-01-01',
        fechaFin: '2026-01-31',
      };

      const campaign = { id: 1, ...createDto, activa: true };
      mockRepository.create.mockReturnValue(campaign);
      mockRepository.save.mockResolvedValue(campaign);

      const result = await service.create(createDto);

      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Campaña Test');
      expect(result.activa).toBe(true);
    });

    it('should throw BadRequestException when end date is before start date', async () => {
      const createDto = {
        nombre: 'Campaña Test',
        lugar: 'Hospital Central',
        fechaInicio: '2026-01-31',
        fechaFin: '2026-01-01',
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const campaigns = [
        { id: 1, nombre: 'Campaña 1', activa: true },
        { id: 2, nombre: 'Campaña 2', activa: false },
      ];
      mockRepository.find.mockResolvedValue(campaigns);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a campaign by id', async () => {
      const campaign = { id: 1, nombre: 'Campaña 1', activa: true };
      mockRepository.findOne.mockResolvedValue(campaign);

      const result = await service.findOne(1);

      expect(result.id).toBe(1);
      expect(result.nombre).toBe('Campaña 1');
    });

    it('should throw NotFoundException when campaign not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a campaign', async () => {
      const campaign = { id: 1, nombre: 'Campaña 1' };
      mockRepository.findOne.mockResolvedValue(campaign);
      mockRepository.remove.mockResolvedValue(campaign);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(campaign);
    });

    it('should throw NotFoundException when campaign not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
